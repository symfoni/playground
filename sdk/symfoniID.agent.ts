import { SymfoniAgent, SymfoniRemote, Context, VC, VP, DID } from "@symfoni/sdk"


const agent = await SymfoniAgent({
	privateKey: "23kfjdlkfjds2", // Get privateKey from secure storage. Out of scope
	context: Context("https://symfoni.id/types/"),
	requests: [
		{ type: VC("UnlockedCar") },
		{ type: VC("DriversLicense") },
		{ type: VC("NationalIdentity") },
	],
	issues: [
		{ type: VC("NationalIdentity") },
	],
	presents: [
		{ type: VP("DriversLicense") },
		{ type: VP("NationalIdentity") },
	],
})
	.onRequest({
		type: VP("DriversLicense"),
		run: ({ type, reason, agent, remote }) => {

			const nationalIdentityVC =
				await agent.request({ type: VC("NationalIdentity"), from: Anyone })

			if (!nationalIdentityVC) return

			const driversLicenceVC =
				await agent.request({ type: VC("DriversLicense"), from: Anyone })

			if (!driversLicenseVC) return

			const vp = agent.createVP({
				type, verifier: remote, vc: [
					nationalIdentityVC,
					driversLicenceVC
				]
			})

			// Ask user const ok = isItOkToSend({vp, to: remote, with: reason }) ?

			if (!ok) return

			agent.present({ vp, to: remote })
		}
	})
	.onRequest({
		type: VP("NationalIdentity"),
		run: ({ type, reason, agent, remote }) => {

			const nationalIdentityVC =
				await agent.request({ type: VC("NationalIdentity"): from: Anyone })

			if (!nationalIdentityVC) return

			const vp = agent.createVP({
				type, verifier: remote, vc: [
					nationalIdentityVC
				]
			})

			// Ask user const ok = isItOkToSend({vp, to: remote, with: reason }) ?

			if (!ok) return

			agent.present({ vp, to: remote })
		}
	})
	.onRequest({
		type: VC("NationalIdentity"),
		run: ({ agent, remote: self, type }) => {

			// Do bankID flow

			const vc = agent.createVC({ type })

			agent.issue({ vc, to: self })
		}
	})
	.onIssue({
		type: VC("NationalIdentity"),
		run: ({ agent, vc, next }) => {
			agent.hold(vc)
			next(vc)
		}
	})
	.onIssue({
		type: VC("DriversLicence"),
		run: ({ agent, vc, next }) => {
			agent.hold(vc)
			next(vc)
		}
	})
	.init()

//
// Legg til fast remote
//
const vegvesen = SymfoniRemote({
	id: DID("https://agent.vegvesen.no"),
	context: Context("https://symfoni.id/types/"),
	requests: [
		{ type: VP("NationalIdentity") },
	],
	issues: [
		{ type: VC("DriversLicense") },
	],
	presents: []
})

agent.connect({ to: vegvesen })

//
// Legg til midlertidig remote, når bruker scanner QR kode
//
const url = scanQR()

const vybil = SymfoniRemote({
	id: DID(url),
	context: Context("https://symfoni.id/types/"),
	requests: [
		{ type: VP("DriversLicense") },
	],
	issues: [
		{ type: VC("UnlockedCar") },
	],
	presents: []
})

agent.onConnect({
	to: vybil,
	run: ({ remote, agent }) => {
		agent.request({ type: VC("UnlockedCar"), from: remote })

		// Car unlocked !!
	}
})
	.connect({ to: vybil })
