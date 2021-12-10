import { SymfoniAgent, SymfoniSocket, AnyRemote } from "@symfoni/agent"
import { SECRET } from "./secure-storage";

const agent = SymfoniAgent()
	.manifest({
		name: "agent.vegvesen.no",
		context: "https://symfoni.id/types/",
		requestsPresentations: [
			{ type: "NationalIdentity" },
		],
		issuesCredentials: [
			{ type: "DriversLicense" },
		],
	})
	.onConnection({
		from: AnyRemote,
		run: ({ remote, agent }) => {
			agent.connect({ to: remote })
		}
	})
	.onCredentialRequest({
		type: "DriversLicense",
		from: AnyRemote,
		run: async ({ agent, remote }) => {
			const vp = await agent.requestPresentation({ type: "NationalIdentity", from: remote })

			// Do database lookup, to see if remote actually has a drivers license

			const vc = agent.createCredential({ type: "DriversLicense", ...vp })

			agent.issue({ vc, to: remote })
		}
	})
	.onPresentation({
		type: "NationalIdentity",
		from: AnyRemote,
		run: ({ agent, vp, next }) => {
			if (agent.verify(vp)) {
				next(vp)
			}
		}
	})

await agent.init({ secret: SECRET })
await agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })
