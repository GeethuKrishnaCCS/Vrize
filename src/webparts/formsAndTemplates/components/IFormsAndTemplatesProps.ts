import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFormsAndTemplatesProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  listName: string;
  laURL: string;
}
export interface IFormsAndTemplatesState {
  formDetails: any[];
  openAddFormModal: boolean;
  formName: string;
  formDescription: string;
  formLink: string;
  currentUser: IUser;
  modaloverlay: { isOpen: boolean, modalText: string };
  ownerEmail: string;
  status: string;
}

export interface IUser {
  id: any;
  email: string;
  title: string;
}