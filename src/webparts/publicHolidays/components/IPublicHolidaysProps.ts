import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IEventLinksConfig } from "../types/Types";

export interface IPublicHolidaysProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext
  limitDate: Date | undefined;
  listName: string;
  webpartTitle: string;
  eventLinksConfig: IEventLinksConfig;
}
