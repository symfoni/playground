import { SymfoniAgent, SymfoniSocket, AnyRemote } from "@symfoni/agent"
import { SECRET } from "./secure-storage";

const agent = SymfoniAgent()
	.manifest({
		name: "agent.vybil.no",
		context: "https://symfoni.id/types/",
		requestsPresentations: [
			{ type: "DriversLicense" },
		],
		issuesCredentials: [
			{ type: "UnlockedCar" },
		],
	})
	.onConnection({
		from: AnyRemote,
		run: ({ remote, agent }) => {
			agent.connect({ to: remote })
		}
	})
	.onCredentialRequest({
		type: "UnlockedCar",
		from: AnyRemote,
		run: async ({ remote, agent }) => {
			const vp = await agent.requestPresentation({ type: "DriversLicense", from: remote, verify: true })

			// Unlock actual car

			const vc = agent.createCredential({ type: "UnlockedCar", ...vp })

			agent.issue({ vc, to: remote })
		}
	})

await agent.init({ secret: SECRET })

await agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })
