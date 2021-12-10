import { SECRET } from "secure-storage";
import { SymfoniAgent, SymfoniSocket, AnyRemote } from "@symfoni/sdk"


const agent = SymfoniAgent()
	.configure({
		name: "agent.vegvesen.no",
		context: "https://symfoni.id/types/",
		requestsPresentations: [
			{ type: "NationalIdentity" },
		],
		issuesCredentials: [
			{ type: "DriversLicense" },
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
		type: "DriversLicense",
		run: async ({ agent, remote }) => {
			const vp = await agent.requestPresentation({ type: "NationalIdentity", from: remote })

			// Do database lookup, to see if remote actually has a drivers license

			const vc = agent.createCredential({ type: "DriversLicense", ...vp })

			agent.issue({ vc, to: remote })
		}
	})
	.onPresentation({
		from: AnyRemote,
		type: "NationalIdentity",
		run: ({ agent, vp, next }) => {
			if (agent.verify(vp)) {
				next(vp)
			}
		}
	})

await agent.init({ secret: SECRET })
await agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })
