import { SymfoniAgentOnEthereum, SymfoniSocket, AnyRemote } from "@symfoni/agent"
import { SECRET } from "./secure-storage";

const agent = SymfoniAgentOnEthereum({
		name: "agent.vybil.no",
		context: "https://symfoni.id/types/",
		requestsPresentations: [
			{ type: "DriversLicense" },
		],
		issuesCredentials: [
			{ type: "UnlockedCar" },
		],
	})
	.onConnect({
		from: AnyRemote,
		run: ({ remote, agent }) => {
			agent.connect({ to: remote })
		}
	})
	.onCredentialRequest({
		type: "UnlockedCar",
		from: AnyRemote,
		run: async ({ type, remote, agent }) => {
			const vp = await agent.requestPresentation({ type: "DriversLicense", from: remote })

			// Unlock actual car

			const vc = agent.createCredential({ type, ...vp })

			agent.issue({ vc, to: remote })
		}
	})
	.onPresentation({
		type: "DriversLicense",
		from: AnyRemote,
		run: ({ agent, vp, next }) => {
			if (agent.verify(vp)) {
				next(vp)
			}
		}
	})

await agent.init({ secret: SECRET })

await agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })
