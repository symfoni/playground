
import { SymfoniAgent, SymfoniIntent } from "@symfoni/agent"
import { SECRET } from "./secure-storage";
import { isItOkToPresent, scanQR, requestBankID } from "./gui";

const agent = SymfoniAgent()
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
		run: ({ agent, from: someone, type, context }) => {
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

//
// Lagre en intent in en QR. En intent starter en flyt.
//
const intentURI = scanQR()

await agent.requestIntent({ intent: SymfoniIntent(intentURI) })
