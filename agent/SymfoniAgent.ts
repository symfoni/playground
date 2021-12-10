export function SymfoniAgent(): BasicSymfoniAgent {
    return {}
}

interface BasicSymfoniAgent {
    //
    // Core functions without side effects
    //
    createCredential: (params: { type: SymfoniType }) => SymfoniVC;

    //
    // Core functions with side effects
    //
    startIntent: (params: { intent: BasicSymfoniIntent }) => Promise<BasicSymfoniAgent | null>;
    finish: (params: { intent: BasicSymfoniIntent }) => void

    requestCredential: (params: { type: SymfoniType, from: SymfoniRemote, hold: boolean }) => Promise<SymfoniVC | null>;
    issue: (params: { vc: SymfoniVC, to: SymfoniRemote }) => void;

    requestPresentation: (params: { type: SymfoniType, from: SymfoniRemote, verify: boolean }) => Promise<SymfoniVP | null>;
    present: (params: { vp: SymfoniVP, to: SymfoniRemote }) => void;

    //
    // Builder functions without side effects
    //
    onIntentStart: (params: {
        context: SymfoniContext,
        type: SymfoniType,
        run: ({ remote, agent }) => Promise<void>
    }) => BasicSymfoniAgent;

    onCredentialRequest: (params: {
        context: SymfoniContext,
        type: SymfoniType,
        run: (params: { reason, agent, from, type, context }) => Promise<void>,
    }) => BasicSymfoniAgent;

    onPresentationRequest: (params: {
        run: (params: { reason, agent, from, vp }) => Promise<void>,
    }) => BasicSymfoniAgent;

    //
    // Builder functions with side effects
    //
    init: (params: { secret: string }) => Promise<BasicSymfoniAgent>

    listen: (params: { to: SymfoniSocket }) => Promise<BasicSymfoniAgent>;
}

export type SymfoniVC = {}
export type SymfoniVP = {}
export type SymfoniRemote = {}
export type SymfoniSocket = {}
export type SymfoniType = {}
export type SymfoniContext = {}

export function SymfoniIntent(intentURI): BasicSymfoniIntent {}

type BasicSymfoniIntent = {}