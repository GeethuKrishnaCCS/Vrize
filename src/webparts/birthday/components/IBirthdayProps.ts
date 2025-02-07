import { WebPartContext } from "@microsoft/sp-webpart-base";
// import { IDateTimeFieldValue } from "@pnp/spfx-property-controls";

export interface IBirthdayProps {
  // selecteddate: IDateTimeFieldValue | undefined;
 
  description: string;
  context: WebPartContext;
  siteUrl: string;
  WebpartTitle: string;
  birthdayListName: string;
  birthdayLibraryName: string;
  defaultLibraryName: string;
  DateEnter: string;
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
