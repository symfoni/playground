
import { SymfoniWallet } from "./lib/SymfoniWallet"

const SECRET = "<secret>"

export const wallet = SymfoniWallet()
	
await wallet.init({ secret: SECRET })
