import { SymfoniAgent, SymfoniPort, SymfoniSecret } from "@symfoni/agent"

const SYMFONI_DID = "did:github:Symfoni";
const SECRET = "<secret>"
const PORT = "<port>"

export const agent = SymfoniAgent()
	.onCredentialRequest({
		context: "https://symfoni.id/credentials/v1/",
		type: "DriversLicense",
		run: async ({ from: user, agent, context, type }) => {
			//
			// Do database lookup, to see if remote actually has a drivers license
			//
			const vc = agent.createCredential({
				context,
				type,
			})

			agent.issue({ vc, to: user })
		},
		requires: {
			context: "https://symfoni.id/presentations/v1/",
			type: "CredentialsPresentation",
			credentials: [
				{
					context: "https://symfoni.id/credentials/v1/",
					type: "NationalIdentity",
					issuer: SYMFONI_DID,
				}
			],
			verifier: {
				name: "Statens Vegvesen"
			},
			reason: [{
				lang: "en",
				text: "Issue Drivers License",
			}, {
				lang: "no",
				text: "Ustede førerkort",
			}],
		},
	})


await agent.init({ secret: SymfoniSecret(SECRET) })

await agent.listen({ to: SymfoniPort(PORT) })
