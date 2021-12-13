
import { scanQR } from "./lib/gui"
import { SymfoniAction } from "./lib/SymfoniAgent"
import { wallet } from "./symfoni.wallet"

export async function test() {
    const actionURI = scanQR()

    // 🤔 await wallet.requestAction({ action: SymfoniAction(actionURI) })
}
