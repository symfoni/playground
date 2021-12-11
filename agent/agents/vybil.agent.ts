import { SymfoniAgent, SymfoniPort, SymfoniSecret } from "../lib/SymfoniAgent"

const PORT = "<port>"
const SECRET = "<secret>"
const SYMFONI_DID = "did:github:Symfoni";
const VEGVESEN_DID = "did:github:Vegvesen";

export const agent = SymfoniAgent()
	.onActionRequest({
		context: "https://symfoni.id/actions/v1/",
		type: "RentCar",
		run: async ({ from: user, agent, action }) => {

			if (user.DriversLicense.classes.contain("A")) {
				startCarRental();
				agent.finish({ action })
			}
		},
		requires: {
			context: "https://symfoni.id/presentations/v1/",
			type: "CredentialsPresentation",
			credentials: [
				{
					context: "https://symfoni.id/credentials/v1/",
					type: "DriversLicense",
					issuer: VEGVESEN_DID,
				},
				{
					context: "https://symfoni.id/credentials/v1/",
					type: "NationalIdentity",
					issuer: SYMFONI_DID,
				}
			],
			verifier: {
				name: "Vybil"
			},
			reason: [{
				lang: "en",
				text: "Start car rental"
			},{
				lang: "no",
				text: "Begynne utleie av bil"
			}]
		}
	})

await agent.init({ secret: SymfoniSecret(SECRET) })

await agent.listen({ to: SymfoniPort(PORT) })
