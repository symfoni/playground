import {
    SymfoniVC,
    SymfoniVP,
    SymfoniRemote,
    SymfoniSocket,
    SymfoniType,
} from "@symfoni"

export interface SymfoniAgent {
    //
    // Util functions
    //
    createVC: (params: { type: SymfoniType }) => SymfoniVC;
    createVP: (params: { type: SymfoniType }) => SymfoniVP;

    requestVC: 
        (params: { type: SymfoniType, from: SymfoniRemote }) => Promise<SymfoniVC | null>;
    requestVP:
        (params: { type: SymfoniType, from: SymfoniRemote }) => Promise<SymfoniVP | null>;

    holdVC: (params: { vc: SymfoniVC }) => void;
    issueVC: (params: { vc: SymfoniVC, to: SymfoniRemote }) => void;
    presentVP: (params: { vp: SymfoniVP, to: SymfoniRemote }) => void;
    verifyVP: (params: { vp: SymfoniVP}) => SymfoniVP | null;
    
    //
    // Builder functions
    //
    init: (config: {
        name: string,   
        secret: string,
        context: string,
        requestsVC: string[] | undefined,
        requestsVP: string[] | undefined,
        issuesVC: string[] | undefined,
        presentsVC: string[] | undefined,
    }) => Promise<SymfoniAgent>;

    onConnect: (params: {
        to: SymfoniRemote,
        run: ({ remote, agent }) => Promise<void>
    }) => Promise<SymfoniAgent>;

    onRequestVC: (params: {
        type: SymfoniType,
        run: (params: { reason, agent, remote, type }) => Promise<void>,
    }) => Promise<SymfoniAgent>;

    onRequestVP: (params: {
        type: SymfoniType,
        run: (params: { reason, agent, remote, type }) => Promise<void>,
    }) => Promise<SymfoniAgent>;

    onIssueVC: (params: {
        type: SymfoniType,
        run: (params: { agent, vc, next }) => Promise<void>,
    }) => Promise<SymfoniAgent>;

    onPresentVP: (params: {
        type: SymfoniType,
        run: (params: { agent, vp, next }) => Promise<void>,
    }) => Promise<SymfoniAgent>;

    listen: (params: { to: SymfoniSocket }) => Promise<SymfoniAgent>;
    
    connect: (params: { to: SymfoniRemote }) => Promise<SymfoniAgent>;
}
