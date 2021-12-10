
import { scanQR } from "./gui"
import { SymfoniIntent } from "./SymfoniAgent"
import { agent } from "./symfoniID.agent"

export async function test() {
    const intentURI = scanQR()

    await agent.startIntent({ intent: SymfoniIntent(intentURI) })
}
