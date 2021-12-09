import {
    SymfoniVC,
    SymfoniVP,
    SymfoniRemote,
    SymfoniSocket,
    SymfoniType,
} from "@symfoni"

interface SymfoniAgent {
    init(): Promise<SymfoniAgent>;

    createVC({ type: SymfoniType }): SymfoniVC;
    createVP({ type: SymfoniType }): SymfoniVP;
    verify(thing: SymfoniVP): boolean;
    hold(thing: SymfoniVC): void;

    listen({ to: SymfoniSocket }): SymfoniAgent;
    connect({ to: SymfoniRemote }): SymfoniAgent;
    onConnect: (params: {
        to: SymfoniRemote,
        run: ({ remote, agent }) => void
    }) => SymfoniAgent;

    request({ type: SymfoniType, from: SymfoniRemote }): void;
    onRequest: (params: {
        type: SymfoniType,
        run: (params: { reason, agent, remote, type }) => void,
    }) => SymfoniAgent;

    issue({ vc: SymfoniVC, to: SymfoniRemote }): void;
    onIssue: (params: {
        type: SymfoniType,
        run: (params: { agent, vc, next }) => void,
    }) => SymfoniAgent;

    present: ({ vp: SymfoniVP, to: SymfoniRemote }) => void;
    onPresent: (params: {
        type: SymfoniType,
        run: (params: { agent, vp, next }) => void,
    }) => SymfoniAgent;
}