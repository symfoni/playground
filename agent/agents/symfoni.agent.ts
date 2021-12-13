import { SymfoniAgent, SymfoniPort, SymfoniSecret } from "@symfoni/agent"

const SECRET = "<secret>"
const PORT = "<port>"

export const agent = SymfoniAgent()
	.onCredentialRequest({
		context: "https://symfoni.id/credentials/v1/",
		type: "NationalIdentity",
		run: async ({ from: user, agent, BankID }) => {

            const vc = agent.createCredential({
                context: "https://symfoni.id/credentials/v1/",
                type: "NationalIdentity",
                evidence: {
                    ...BankID
                }
			})

			agent.issue({ vc, to: user })
		},
	})


await agent.init({ secret: SymfoniSecret(SECRET) })

await agent.listen({ to: SymfoniPort(PORT) })
