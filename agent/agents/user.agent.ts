
import { SymfoniAgent, resolvePresentation } from "../lib/SymfoniAgent"
import { isItOkToPresent, requestBankID } from "../lib/gui";

const SECRET = "<secret>"

export const agent = SymfoniAgent()
	.onPresentationRequest({
		context: "https://symfoni.id/presentations/v1/",
		type: "CredentialsPresentation",
		run: async ({ from: remote, reason, agent, request }) => {
			const vp = resolvePresentation({ request })
			//
			// Ask user if ok to present credentials ?
			//
			const ok = isItOkToPresent({ vp, to: remote, with: reason })
			if (!ok) return

			agent.present({ vp, to: remote })
		}
	})
	.onPresentationRequest({
		context: "https://symfoni.id/presentations/v1/",
		type: "BankIDPresentation",
		run: async ({ agent, from: remote }) => {
			//
			// Do bankID flow
			//
			const jwt = requestBankID()
			
			const evidence = agent.createPresentation({
				context: "https://symfoni.id/presentations/v1/",
				type: "BankIDPresentation",
				credentials: [
					agent.createCredential({
						context: "https://symfoni.id/credentials/v1/",
						type: "BankID",
						credentialSubject: {
							bankID: { type: "BankID", jwt } }
						}
					)
				]
			})

			agent.present({ vp: evidence, to: remote })
		}
	})

await agent.init({ secret: SECRET })
