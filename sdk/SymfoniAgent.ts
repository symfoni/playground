import {
    SymfoniVC,
    SymfoniVP,
    SymfoniRemote,
    SymfoniSocket,
    SymfoniType,
    Someone,
} from "@symfoni/agent"


export function SymfoniAgentOnEthereum(manifest: {
    name: string,   
    context: string,
    requestsCredentials: SymfoniType[],
    requestsPresentations: SymfoniType[],
    issuesCredentials: SymfoniType[],
    presentsPresentations: SymfoniType[],
}): SymfoniAgent {
    return manifest;
}

interface SymfoniAgent {
    //
    // Util functions
    //
    createCredential: (params: { type: SymfoniType }) => SymfoniVC;
    createPresentation: (params: { type: SymfoniType }) => SymfoniVP;

    requestCredential: 
        (params: { type: SymfoniType, from: SymfoniRemote }) => Promise<SymfoniVC | null>;
    requestPresentation:
        (params: { type: SymfoniType, from: SymfoniRemote }) => Promise<SymfoniVP | null>;

    issue: (params: { vc: SymfoniVC, to: SymfoniRemote }) => void;
    hold: (params: { vc: SymfoniVC }) => void;
    present: (params: { vp: SymfoniVP, to: SymfoniRemote }) => void;
    verify: (params: { vp: SymfoniVP}) => SymfoniVP | null;

    setManifest: (manifest: {
        name: string,   
        context: string,
        requestsCredentials: SymfoniType[],
        requestsPresentations: SymfoniType[],
        issuesCredentials: SymfoniType[],
        presentsPresentations: SymfoniType[],
    }) => void

    //
    // Builder functions
    //
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

    onCredential: (params: {
        from: Someone,
        type: SymfoniType,
        run: (params: { agent, vc, next }) => Promise<void>,
    }) => SymfoniAgent;

    onPresentation: (params: {
        from: Someone,
        type: SymfoniType,
        run: (params: { agent, vp, next }) => Promise<void>,
    }) => SymfoniAgent;

    init: ({ secret: string }) => Promise<SymfoniAgent>

    listen: (params: { to: SymfoniSocket }) => Promise<SymfoniAgent>;
    
    connect: (params: { to: SymfoniRemote }) => Promise<SymfoniAgent>;
}
