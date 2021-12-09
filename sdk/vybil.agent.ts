import { SymfoniAgent, SymfoniSocket, Anyone } from "@symfoni/sdk"


SymfoniAgent()
	.init({
		name: "agent.vybil.no",
		secret: SECRET,
		context: "https://symfoni.id/types/",
		requestsVP: [
			{ type: "DriversLicense" },
		],
		issuesVC: [
			{ type: "UnlockedCar" },
		],
	})
	.onConnect({
		to: Anyone,
		run: ({ remote, agent }) => {
			agent.connect({ to: remote })
		}
	})
	.onRequestVC({
		type: "UnlockedCar",
		run: async ({ type, remote, agent }) => {
			const vp = await agent.requestVP({ type: "DriversLicense", from: remote })

			// Unlock actual car

			const vc = agent.createVC({ type, ...vp })

			agent.issueVC({ vc, to: remote })
		}
	})
	.onPresentVP({
		type: "DriversLicense",
		run: ({ agent, vp, next }) => {
			if (agent.verifyVP(vp)) {
				next(vp)
			}
		}
	})
	.listen({ to: SymfoniSocket("127.0.0.1:3001") })
