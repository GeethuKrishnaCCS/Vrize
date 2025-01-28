import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  listName: string;
  WebpartTitle: string;
}
export interface IBirthdayState {
  currentUser: IUser;
  modaloverlay: { isOpen: boolean, modalText: string };
  employeeData: any[];
  birthdaygreetings: any[];
}

export interface IUser {
  id: any;
  email: string;
  title: string;
}
