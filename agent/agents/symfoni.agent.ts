import { SymfoniAgent, SymfoniPort, SymfoniSecret } from "@symfoni/agent"

const SECRET = "<secret>"
const PORT = "<port>"

export const agent = SymfoniAgent()
	.onCredentialRequest({
		context: "https://symfoni.id/credentials/v1/",
		type: "NationalIdentity",
		run: async ({ from: user, agent }) => {

            const vc = agent.createCredential({
                context: "https://symfoni.id/credentials/v1/",
                type: "NationalIdentity",
                evidence: {
                    ...user.BankID
                }
			})

			agent.issue({ vc, to: user })
		},
		requires: [{
			context: "https://symfoni.id/presentations/v1/",
			type: "BankIDPresentation",
			credentials: [
				{
					context: "https://symfoni.id/credentials/v1/",
					type: "BankID",
				}
			],
			verifier: {
				name: "Symfoni AS"
			},
			reason: [{
				lang: "en",
				text: "Issue national ID",
			}, {
				lang: "no",
				text: "Ustede nasjonal ID",
			}],
		}],
	})


await agent.init({ secret: SymfoniSecret(SECRET) })

await agent.listen({ to: SymfoniPort(PORT) })
