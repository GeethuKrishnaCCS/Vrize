import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IBirthdayProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  WebpartTitle: string;
  birthdayListName: string;
  birthdayLibraryName: string;
  DateEnter: string;
  DefaultGalleryName: string;
  heading: string;
  headingColor: any;
  body: string;
  bodyColor: any;
  GreetingsListName: string;
  buttonName: string;
  buttonColor: any;
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
