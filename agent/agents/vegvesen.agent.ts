import { SymfoniAgent, SymfoniPort, SymfoniSecret } from "../lib/SymfoniAgent"

const SECRET = "<secret>"
const PORT = "<port>"

export const agent = SymfoniAgent()
	.onCredentialRequest({
		context: "https://symfoni.id/credentials/v1/",
		type: "DriversLicense",
		run: async ({ from: user, agent, context, type, credentials }) => {

			const [NationalIdentity] = credentials;
			if (NationalIdentity === undefined) {
				return;
			}
			//
			// Do database lookup, to see if remote actually has a drivers license
			//
			const vc = agent.createCredential({
				context,
				type,
			})

			agent.issue({ vc, to: user })
		},
	})


await agent.init({ secret: SymfoniSecret(SECRET) })

await agent.listen({ to: SymfoniPort(PORT) })
