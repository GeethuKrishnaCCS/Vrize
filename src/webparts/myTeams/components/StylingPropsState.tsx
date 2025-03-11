import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface StylingState {
    Employees: any[];
    RenderedEmployees: any[];
    UpdateCount: number;
    Next: number;
    Count: number;

}
export interface StylingProps {
    users: any[];
    context: WebPartContext;
    WebpartTitle: string;
}
