import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayCarouselProps {
  context: WebPartContext
  birthdayListName: string;
  NoOfItemDisplay: any;
  webpartName: string;
  DefaultGalleryName: string;
  heading: string;
  headingColor: any;
  body: string;
  bodyColor: any;
  GreetingsListName: string;
  buttonName: string;
  buttonColor: any;
}
export interface IBirthdayCarouselState {
  listItems: [];
  today: string;
  greetings: any;
  currentIndex: any;
  itemsPerPage: any;
  showGreetingsModal: boolean;
  greetingsMail: string;
  greetingsName: string;
  heading: string;
  headingColor: any;
  body: string;
  bodyColor: any;
  buttonColor: any;
}