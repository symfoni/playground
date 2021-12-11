
import { scanQR } from "./lib/gui"
import { SymfoniAction } from "./lib/SymfoniAgent"
import { agent as user } from "./agents/user.agent"

export async function test() {
    const actionURI = scanQR()

    await user.requestAction({ action: SymfoniAction(actionURI) })
}
