import { SymfoniAgent, SymfoniSocket, DID, VC, VP, Anyone, Context } from "@symfoni/sdk"


const agent = await SymfoniAgent({
	secret: getSecret(),
	id: DID("https://agent.vybil.no"),
	context: Context("https://symfoni.id/types/"),
	requests: [
		{ type: VP("DriversLicense") },
	],
	issues: [
		{ type: VC("UnlockedCar") },
	],
})
	.onConnect({
		to: Anyone,
		run: ({ remote, agent }) => {
			agent.connect({ to: remote })
		}
	})
	.onRequest({
		type: VC("UnlockedCar"),
		run: ({ type, remote, agent }) => {
			const vp = agent.request({ type: VP("DriversLicense"), from: remote })

			// Unlock actual car

			const vc = agent.createVC({ type })
			agent.issue({ vc, to: remote })
		}
	})
	.onPresent({
		type: VP("DriversLicense"),
		run: ({ agent, vp, next }) => {
			if (agent.verify(vp)) {
				next(vp)
			}
		}
	})
	.init()


agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })