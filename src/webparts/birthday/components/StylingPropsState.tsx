import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface StylingState {
    Employees: any[];
    RenderedEmployees: any[];
    UpdateCount: number;
    Next: number;
    Count: number;
    Reload: boolean;
    showGreetingsModal: boolean;
    greetingsMail: string;
    greetingsName: string;
    heading: string;
    headingColor: any;
    body: string;
    bodyColor: any;

}
export interface StylingProps {
    employeesBirthday: any[];
    Reload: boolean;
    context: WebPartContext;
    WebpartTitle: string;
    DateEnter: string;
    DefaultGalleryName: string;
    heading: string;
    headingColor: any;
    body: string;
    bodyColor: any;
    GreetingsListName: string;
    Service: any;
}
