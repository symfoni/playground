import {
    SymfoniVC,
    SymfoniVP,
    SymfoniRemote,
    SymfoniSocket,
    SymfoniType,
    SymfoniContext,
    SymfoniIntent,
} from "@symfoni/agent"


interface SymfoniAgent {
    //
    // Core functions without side effects
    //
    createCredential: (params: { type: SymfoniType }) => SymfoniVC;

    //
    // Core functions with side effects
    //
    requestCredential: (params: { type: SymfoniType, from: SymfoniRemote, hold: boolean }) => Promise<SymfoniVC | null>;
    requestPresentation: (params: { type: SymfoniType, from: SymfoniRemote, verify: boolean }) => Promise<SymfoniVP | null>;
    issue: (params: { vc: SymfoniVC, to: SymfoniRemote }) => void;
    present: (params: { vp: SymfoniVP, to: SymfoniRemote }) => void;

    //
    // Builder functions without side effects
    //
    onIntentRequest: (params: {
        context: SymfoniContext,
        type: SymfoniType,
        run: ({ remote, agent }) => Promise<void>
    }) => SymfoniAgent;

    onCredentialRequest: (params: {
        context: SymfoniContext,
        type: SymfoniType,
        run: (params: { reason, agent, remote, type }) => Promise<void>,
    }) => SymfoniAgent;

    onPresentationRequest: (params: {
        run: (params: { reason, agent, remote, type }) => Promise<void>,
    }) => SymfoniAgent;

    //
    // Builder functions with side effects
    //
    init: (params: { secret: string }) => Promise<SymfoniAgent>

    listen: (params: { to: SymfoniSocket }) => Promise<SymfoniAgent>;

    start: (params: { intent: SymfoniIntent }) => Promise<SymfoniAgent>;

    finish: (params: { intent: SymfoniIntent }) => Promise<SymfoniAgent>;
}
