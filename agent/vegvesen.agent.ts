import { SymfoniAgent, SymfoniSocket } from "@symfoni/agent"
import { SECRET } from "./secure-storage";


const agent = SymfoniAgent()
	.onCredentialRequest({
		context: "https://symfoni.id/credentials/v1/",
		type: "DriversLicense",
		run: async ({ agent, from: someone, context, type }) => {

			await agent.requestPresentation({
				from: someone,
				reason: "Ustede førerkort",
				credentials: [
					{
						context,
						type: "NationalIdentity",
						issuer: someone.did,
					}
				]
			})
			//
			// Do database lookup, to see if remote actually has a drivers license
			//
			const vc = agent.createCredential({
				context,
				type,
			})

			agent.issue({ vc, to: someone })
		}
	})


await agent.init({ secret: SECRET })

await agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })
