
import { SymfoniAgent } from "./SymfoniAgent"
import { SECRET } from "./secure-storage";
import { isItOkToPresent, requestBankID } from "./gui";

export const agent = SymfoniAgent()
	.onPresentationRequest({
		run: async ({ reason, agent, from: someone, vp }) => {
			//
			// Ask user ?
			//
			const ok = isItOkToPresent({ vp, to: someone, with: reason })
			if (!ok) return

			agent.present({ vp, to: someone })
		}
	})
	.onCredentialRequest({
		context: "https://symfoni.id/credentials/v1/",
		type: "NationalIdentity",
		run: async ({ agent, from: someone, type, context }) => {
			//
			// Do bankID flow
			//
			const jwt = requestBankID()

			const vc = agent.createCredential({
				context,
				type,
				credentialSubject: {
					nationalIdentity: {
						identityNumber: "pnr",
						nationality: "NOR", 
					}
				},
				evidence: { type: "BankIDjwt", jwt } 
			})

			agent.issue({ vc, to: someone })
		}
	})

await agent.init({ secret: SECRET })
