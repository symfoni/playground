import { SymfoniAgent, SymfoniRemote, DID, Anyone } from "@symfoni/sdk"


const agent = await SymfoniAgent()
	.init({
		name: "app.symfoni.id",
		secret: SECRET,
		context: "https://symfoni.id/types/",
		requestsVC: [
			{ type: "UnlockedCar" },
			{ type: "DriversLicense" },
			{ type: "NationalIdentity" },
		],
		issuesVC: [
			{ type: "NationalIdentity" },
		],
		presentsVP: [
			{ type: "DriversLicense" },
			{ type: "NationalIdentity" },
		],
	})
	.onRequestVP({
		type: "DriversLicense",
		run: async ({ type, reason, agent, remote }) => {

			const nationalIdentityVC =
				await agent.requestVC({ type: "NationalIdentity", from: Anyone })

			if (!nationalIdentityVC) return

			const driversLicenceVC =
				await agent.requestVC({ type: "DriversLicense", from: Anyone })

			if (!driversLicenseVC) return

			const vp = agent.createVP({
				type,
				verifier: remote,
				vc: [
					nationalIdentityVC,
					driversLicenceVC
				]
			})

			// Ask user const ok = isItOkToSend({vp, to: remote, with: reason }) ?

			if (!ok) return

			agent.presentVP({ vp, to: remote })
		}
	})
	.onRequestVP({
		type: "NationalIdentity",
		run: async ({ type, reason, agent, remote }) => {

			const nationalIdentityVC =
				await agent.requestVC({ type: "NationalIdentity", from: Anyone })

			if (!nationalIdentityVC) return

			const vp = agent.createVP({
				type, verifier: remote, vc: [
					nationalIdentityVC
				]
			})

			// Ask user const ok = isItOkToSend({vp, to: remote, with: reason }) ?

			if (!ok) return

			agent.presentVP({ vp, to: remote })
		}
	})
	.onRequestVC({
		type: "NationalIdentity",
		run: ({ agent, remote: self, type }) => {

			// Do bankID flow

			const vc = agent.createVC({ type })

			agent.issueVC({ vc, to: self })
		}
	})
	.onIssueVC({
		type: "NationalIdentity",
		run: ({ agent, vc, next }) => {
			agent.holdVC(vc)
			next(vc)
		}
	})
	.onIssueVC({
		type: "DriversLicence",
		run: ({ agent, vc, next }) => {
			agent.holdVC(vc)
			next(vc)
		}
	})
	.connect({
		to: SymfoniRemote({
			id: DID("https://agent.vegvesen.no"),
			context: "https://symfoni.id/types/",
			requestsVP: [
				{ type: "NationalIdentity" },
			],
			issuesVC: [
				{ type: "DriversLicense" },
			],
		})
	})

//
// Legg til midlertidig remote, når bruker scanner QR kode
//
const symfoniRemoteParams = scanQR()

const vybil = SymfoniRemote(symfoniRemoteParams)

agent.connect({ to: vybil }).onConnect({
	to: vybil,
	run: async ({ remote, agent }) => {
		await agent.requestVC({ type: "UnlockedCar", from: remote })

		// Car unlocked !!
	}
})
	
