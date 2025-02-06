import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  WebpartTitle: string;
  birthdayListName: string;
  birthdayLibraryName: string;
  defaultLibraryName: string;
}
export interface IBirthdayState {
  currentUser: IUser;
  modaloverlay: { isOpen: boolean, modalText: string };
  employeesBirthday: any[];
  Reload: boolean;
}

export interface IUser {
  id: any;
  email: string;
  title: string;
}
