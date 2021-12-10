import { SECRET } from "secure-storage";
import { SymfoniAgent, SymfoniSocket, AnyRemote } from "@symfoni/sdk"


const agent = SymfoniAgent()
	.configure({
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
		from: AnyRemote,
		type: "UnlockedCar",
		run: async ({ type, remote, agent }) => {
			const vp = await agent.requestPresentation({ type: "DriversLicense", from: remote })

			// Unlock actual car

			const vc = agent.createCredential({ type, ...vp })

			agent.issue({ vc, to: remote })
		}
	})
	.onPresentation({
		from: AnyRemote,
		type: "DriversLicense",
		run: ({ agent, vp, next }) => {
			if (agent.verify(vp)) {
				next(vp)
			}
		}
	})

await agent.init({ secret: SECRET })

await agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })
