import { SymfoniAgent, SymfoniSocket, DID, VC, VP, Anyone, Context } from "@symfoni/sdk"


const agent = await SymfoniAgent({
	secret: getSecret(),
	id: DID("https://agent.vegvesen.no"),
	context: Context("https://symfoni.id/types/"),
	requests: [
		{ type: VP("NationalIdentity") },
	],
	issues: [
		{ type: VC("DriversLicense") },
	],
})
	.onConnect({
		to: Anyone,
		run: ({ remote, agent }) => {
			agent.connect({ to: remote })
		}
	})
	.onRequest({
		type: VC("DriversLicense"),
		run: ({ type, agent, remote }) => {
			const vp = await agent.request({
				type: VP("NationalIdentity"),
				from: remote,
			})

			// Do database lookup, to see if remote actually has a drivers license

			const vc = agent.createVC({ type })

			agent.issue({ vc, to: remote })
		}
	})
	.onPresent({
		type: VP("NationalIdentity"),
		run: ({ agent, vp, next }) => {
			if (agent.verify(vp)) {
				next(vp)
			}
		}
	})
	.init()


agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })
