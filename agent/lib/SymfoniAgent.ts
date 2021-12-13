
type SymfoniAgentType = {
    //
    // Core functions without side effects
    //
    createCredential: (params: { context: SymfoniContext, type: SymfoniType }) => SymfoniCredential;
    createPresentation: (params: { context: SymfoniContext, type: SymfoniType }) => SymfoniPresentation;

    //
    // Core functions with side effects
    //
    requestAction: (params: { action: SymfoniActionType }) => Promise<SymfoniActionType | null>;
    finish: (params: { action: SymfoniActionType }) => void

    requestCredential: (params: { type: SymfoniType, from: SymfoniRemote, hold: boolean }) => Promise<SymfoniCredential | null>;
    issue: (params: { vc: SymfoniCredential, to: SymfoniRemote }) => void;

    requestPresentation: (params: { type: SymfoniType, from: SymfoniRemote, verify: boolean }) => Promise<SymfoniPresentation | null>;
    present: (params: { vp: SymfoniPresentation, to: SymfoniRemote }) => void;

    init: (params: { secret: SymfoniSecretType }) => Promise<void>
    listen: (params: { to: SymfoniPortType }) => Promise<void>;

    //
    // Builder functions without side effects
    //
    onActionRequest: (params: {
        context: SymfoniContext,
        type: SymfoniType,
        run: (params: { agent, from: SymfoniRemote, action }) => Promise<void>,
    }) => SymfoniAgentType;

    onCredentialRequest: (params: {
        context: SymfoniContext,
        type: SymfoniType,
        run: (params: { reason, agent, from: SymfoniRemote, type, context }) => Promise<void>,
    }) => SymfoniAgentType;

    onPresentationRequest: (params: {
        context: SymfoniContext,
        type: SymfoniType,
        run: (params: { reason, agent, from: SymfoniRemote, request }) => Promise<void>,
    }) => SymfoniAgentType;

}

export function SymfoniAgent(): SymfoniAgentType {}

export type SymfoniPresentationRequestType = {}
export type SymfoniCredential = {}
export type SymfoniPresentation = {}
export type SymfoniRemote = {}
export function SymfoniPort(port): SymfoniPortType {}
export type SymfoniPortType = {}

export type SymfoniType = {}
export type SymfoniContext = {}

export function SymfoniSecret(secret): SymfoniSecretType {}
export type SymfoniSecretType = {}

export function SymfoniAction(actionURI): SymfoniActionType {}
type SymfoniActionType = {}


export function resolvePresentation({ request: SymfoniPresentationRequest }) {}