import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayCarouselProps {
  context: WebPartContext
  birthdayListName: string;
  NoOfItemDisplay: any;
  webpartName: string;
  DefaultGalleryUrl: string;
}
export interface IBirthdayCarouselState {
  listItems: [];
  today: string;
  greetings: any;
  currentIndex: any;
  itemsPerPage: any;
}