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
  employeesBirthday: any[];
  Reload: boolean;
  openAddFormModal: boolean;
  name: string;
  designation: string;
  dateOfBirth: any;
  selectedFile: any;
}

export interface IUser {
  id: any;
  email: string;
  title: string;
}
