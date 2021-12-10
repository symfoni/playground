import {
    SymfoniVC,
    SymfoniVP,
    SymfoniRemote,
    SymfoniSocket,
    SymfoniType,
    Someone,
} from "@symfoni/agent"


interface SymfoniAgent {
    //
    // Core functions without side effects
    //
    createCredential: (params: { type: SymfoniType }) => SymfoniVC;
    createPresentation: (params: { type: SymfoniType }) => SymfoniVP;
    verify: (params: { vp: SymfoniVP}) => SymfoniVP | null;

    //
    // Core functions with side effects
    //
    requestCredential: (params: { type: SymfoniType, from: SymfoniRemote, hold: boolean }) => Promise<SymfoniVC | null>;
    requestPresentation: (params: { type: SymfoniType, from: SymfoniRemote, verify: boolean }) => Promise<SymfoniVP | null>;
    issue: (params: { vc: SymfoniVC, to: SymfoniRemote }) => void;
    hold: (params: { vc: SymfoniVC }) => void;
    present: (params: { vp: SymfoniVP, to: SymfoniRemote }) => void;

    //
    // Builder functions without side effects
    //
    manifest: (manifest: {
        name: string,   
        context: string,
        requestsCredentials: SymfoniType[],
        requestsPresentations: SymfoniType[],
        issuesCredentials: SymfoniType[],
        presentsPresentations: SymfoniType[],
    }) => SymfoniAgent

    onConnection: (params: {
        from: Someone,
        run: ({ remote, agent }) => Promise<void>
    }) => SymfoniAgent;

    onCredentialRequest: (params: {
        from: Someone,
        type: SymfoniType,
        run: (params: { reason, agent, remote, type }) => Promise<void>,
    }) => SymfoniAgent;

    onPresentationRequest: (params: {
        from: Someone,
        type: SymfoniType,
        run: (params: { reason, agent, remote, type }) => Promise<void>,
    }) => SymfoniAgent;

    //
    // Builder functions with side effects
    //
    init: ({ secret: string }) => Promise<SymfoniAgent>

    listen: (params: { to: SymfoniSocket }) => Promise<SymfoniAgent>;
    
    connect: (params: { to: SymfoniRemote }) => Promise<SymfoniAgent>;
}
