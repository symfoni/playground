import { SymfoniAgent, SymfoniSocket, Anyone } from "@symfoni/sdk"


SymfoniAgent()
	.init({
		name: "agent.vegvesen.no",
		secret: SECRET,
		context: "https://symfoni.id/types/",
		requestsVP: [
			{ type: "NationalIdentity" },
		],
		issuesVC: [
			{ type: "DriversLicense" },
		],
	})
	.onConnect({
		to: Anyone,
		run: ({ remote, agent }) => {
			agent.connect({ to: remote })
		}
	})
	.onRequestVC({
		type: "DriversLicense",
		run: async ({ agent, remote }) => {
			const vp = await agent.requestVP({ type: "NationalIdentity", from: remote })

			// Do database lookup, to see if remote actually has a drivers license

			const vc = agent.createVC({ type: "DriversLicense", ...vp })

			agent.issue({ vc, to: remote })
		}
	})
	.onPresentVP({
		type: "NationalIdentity",
		run: ({ agent, vp, next }) => {
			if (agent.verifyVP(vp)) {
				next(vp)
			}
		}
	})
	.listen({ to: SymfoniSocket("127.0.0.1:3001") })
