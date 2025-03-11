import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRewardsCarouselProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  WebpartTitle: string;
  groupName: string;
  rewardsListName: string;
  rewardsLibraryName: string;
  defaultLibraryName: string;
  isAutorotate: boolean;
  duration: number;
  width: number;
  height: number;
  ColumnSection: string;
  category: string;
}
export interface IRewardsCarouselState {
  employeesReward: any[];
}
export class Constants {

  public static get CaroselMax(): number {
    return 10;
  }

}