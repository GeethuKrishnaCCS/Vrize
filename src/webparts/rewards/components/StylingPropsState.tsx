import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface StylingState {
    Employees: any[];
    RenderedEmployees: any[];
    UpdateCount: number;
    Next: number;
    Count: number;
    Reload: boolean;

}
export interface StylingProps {
    employeesReward: any[];
    Reload: boolean;
    context: WebPartContext;
    WebpartTitle: string;
}
