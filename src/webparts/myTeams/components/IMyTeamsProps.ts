import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMyTeamsProps {
  context: WebPartContext;
  siteUrl: string;
  WebpartTitle: string;
}
export interface IMyTeamsState {
  currentUser: IUser;
  managers: any[];
  responders: any[];

}
export interface IUser {
  id: any;
  email: string;
  title: string;
}
