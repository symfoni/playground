import { SymfoniAgent, SymfoniPort, SymfoniSecret } from "../lib/SymfoniAgent"

const PORT = "<port>"
const SECRET = "<secret>"

export const agent = SymfoniAgent()
	.context("https://symfoni.id/context/v0/")
	.onActionRequest({
		type: "StartCarRental",
		run: async ({ agent, action, credentials }) => {

			const [NationalIdentity, DriversLicense] = credentials;
			if (NationalIdentity === undefined) {
				return;
			}

			if (!DriversLicense?.classes?.contain("A")) {
				return;
			}

			startCarRental();
			agent.finish({ action })
		},
	})

await agent.init({ secret: SymfoniSecret(SECRET) })

await agent.listen({ to: SymfoniPort(PORT) })
