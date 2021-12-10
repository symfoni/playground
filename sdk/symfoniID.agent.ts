
import { SymfoniAgentOnEthereum, SymfoniRemote, DID, Anyone, AnyRemote, Self } from "@symfoni/agent"
import { SECRET } from "./secure-storage";
import { isItOkToSend, scanQR } from "./gui";

const agent = SymfoniAgentOnEthereum({
		name: "app.symfoni.id",
		context: "https://symfoni.id/types/",
		requestsCredentials: [
			{ type: "UnlockedCar" },
			{ type: "DriversLicense" },
			{ type: "NationalIdentity" },
		],
		issuesCredentials: [
			{ type: "NationalIdentity" },
		],
		presentsPresentations: [
			{ type: "DriversLicense" },
			{ type: "NationalIdentity" },
		],
	})
	.onPresentationRequest({
		type: "DriversLicense",
		from: AnyRemote,
		run: async ({ reason, agent, from: remote }) => {

			const nationalIdentity =
				await agent.requestCredential({ type: "NationalIdentity", from: Anyone })

			if (!nationalIdentity) return

			const driversLicense =
				await agent.requestCredential({ type: "DriversLicense", from: Anyone })

			if (!driversLicense) return

			const vp = agent.createPresentation({
				type: "DriversLicense",
				verifier: remote,
				credentials: [
					nationalIdentity,
					driversLicense
				]
			})

			// Ask user ?
			const ok = isItOkToSend({ vp, to: remote, with: reason })

			if (!ok) return

			agent.present({ vp, to: remote })
		}
	})
	.onPresentationRequest({
		type: "NationalIdentity",
		from: AnyRemote,
		run: async ({ reason, agent, from: remote }) => {

			const nationalIdentity =
				await agent.requestCredential({ type: "NationalIdentity", from: Anyone })

			if (!nationalIdentity) return

			const vp = agent.createPresentation({
				type: "NationalIdentity", 
				verifier: remote, 
				credentials: [
					nationalIdentity
				]
			})

			// Ask user ?
			const ok = isItOkToSend({ vp, to: remote, with: reason })

			if (!ok) return

			agent.present({ vp, to: remote })
		}
	})
	.onCredentialRequest({
		type: "NationalIdentity",
		from: Self,
		run: ({ agent, type, from: self }) => {

			// Do bankID flow

			const vc = agent.createCredential({ type })

			agent.issue({ vc, to: self })
		}
	})
	.onCredential({
		type: "NationalIdentity",
		from: Self,
		run: ({ agent, vc, next }) => {
			agent.hold(vc)
			next(vc)
		}
	}))
	.onCredential({
		type: "DriversLicence",
		from: AnyRemote,
		run: ({ agent, vc, next }) => {
			agent.hold({ vc })
			next(vc)
		}
	})

	
await agent.init({ secret: SECRET })

await agent.connect({
	to: SymfoniRemote("https://agent.vegvesen.no"),
})

//
// Legg til midlertidig remote, når bruker scanner QR kode
//
const url = scanQR()

const vybil = SymfoniRemote(url)

agent.onConnect({
	from: vybil,
	run: async ({ agent }) => {
		await agent.requestCredential({ type: "UnlockedCar", from: vybil })

		// Car unlocked !!
	}
})

await agent.connect({ to: vybil })
