import { SymfoniAgent, SymfoniSocket } from "@symfoni/agent"
import { SECRET } from "./secure-storage";

const VEGVESEN_DID = "did:github:Vegvesen";

const agent = SymfoniAgent()
	.onIntentRequest({
		context: "https://symfoni.id/intents/v1/",
		type: "RentCar",
		run: async ({ from: someone, agent, context, intent }) => {

			await agent.requestPresentation({
				from: someone,
				reason: "Leie bil",
				credentials: [
					{
						context,
						type: "DriversLicense",
						issuer: VEGVESEN_DID,
					},
					{
						context,
						type: "NationalIdentity",
						issuer: someone.did,
					}
				]
			})
			//
			// Unlock actual car
			//
			agent.finish({ intent })
		}
	})

await agent.init({ secret: SECRET })

await agent.listen({ to: SymfoniSocket("127.0.0.1:3001") })
