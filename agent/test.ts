
import { scanQR } from "./gui"
import { SymfoniIntent } from "./SymfoniAgent"
import SymfoniIDAgent from "./symfoniID.agent"

export async function test() {
    const intentURI = scanQR()

    await SymfoniIDAgent.startIntent({ intent: SymfoniIntent(intentURI) })   
}
