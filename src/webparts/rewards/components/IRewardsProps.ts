import { IDropdownOption } from "@fluentui/react";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRewardsProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  WebpartTitle: string;
  groupName: string;
  rewardsListName: string;
  rewardsLibraryName: string;
  defaultLibraryName: string;
  categoryListName: string;
}

export interface IRewardsState {
  currentUser: IUser;
  modaloverlay: { isOpen: boolean, modalText: string };
  employeesReward: any[];
  Reload: boolean;
  openAddFormModal: boolean;
  name: string;
  designation: string;
  dateOfBirth: any;
  selectedFile: any;
  isAdmin: boolean;
  issueDate: any;
  categoryOptions: IDropdownOption[];
  category: { key: any, text: string };
}

export interface IUser {
  id: any;
  email: string;
  title: string;
}
