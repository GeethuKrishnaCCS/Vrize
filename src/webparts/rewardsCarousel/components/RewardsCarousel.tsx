import * as React from 'react';
import styles from './RewardsCarousel.module.scss';
import type { IRewardsCarouselProps, IRewardsCarouselState } from './IRewardsCarouselProps';
import { BaseService } from '../../../shared/services/BaseService';
import { Carousel } from './Carousel';
import * as moment from 'moment';
import { Link } from '@fluentui/react';

export default class RewardsCarousel extends React.Component<IRewardsCarouselProps, IRewardsCarouselState, {}> {
  private service: BaseService;/* To call the service file */
  constructor(props: IRewardsCarouselProps) {
    super(props);
    this.state = {
      employeesReward: [],
    }
    const siteURL = window.location.protocol + "//" + window.location.hostname + this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);
    this.getEmployeeDatas = this.getEmployeeDatas.bind(this);
    this.linkClick = this.linkClick.bind(this);
  }
  public async componentDidMount() {
    await this.getEmployeeDatas();
  }
  private async getEmployeeDatas() {
    let imageurl: any;
    const queryurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.rewardsListName;
    const selectquery = "*,Category/Title,Category/ID";
    const expandquery = "Category";
    const employeeData = await this.service.getItemsSelectExpand(queryurl, selectquery, expandquery);
    if (employeeData) {
      const EmployeeDetails: any[] = [];
      for (let i = 0; i < 5; i++) {
        const item = employeeData[i];
        if (item.ImageLink === null) {
          const queryURL = this.props.context.pageContext.web.serverRelativeUrl + "/" + this.props.defaultLibraryName;
          const selectquery = "*,FileRef,FileLeafRef"
          const imagedoc = await this.service.getImageItems(queryURL, selectquery);
          console.log(imagedoc);
          for (let i = 0; i < imagedoc.length; i++) {
            const image = imagedoc[i];
            if (image.DefaultType === "Default") {
              imageurl = image.FileRef;
            }
          }
        }
        else {
          imageurl = item.ImageLink.Url
        }
        // if (item.Category.Title === this.props.category) {
        EmployeeDetails.push({
          ImageURL: imageurl,
          Designation: item.Designation,
          FullName: item.EmployeeName,
          Year: moment(item.IssueDate).format("YYYY"),
          Category: item.Category.Title
        });
        // }
      }
      console.log('greetings: ', EmployeeDetails);
      this.setState({
        employeesReward: EmployeeDetails
      })
    }
  }
  public linkClick() {
    const rewardsandbirthdaylink =
      this.props.context.pageContext.web.absoluteUrl +
      "/SitePages/RewardsAndBirthdays.aspx";
    window.open(rewardsandbirthdaylink, "_self", "noopener,noreferrer");
  }
  public render(): React.ReactElement<IRewardsCarouselProps> {


    return (
      <section className={`${styles.rewardsCarousel}`}>
        <div className={styles.heading}>
          <h1 className={styles.pagetitle}>{this.props.WebpartTitle}</h1>
          <Link className={styles.viewAll} onClick={this.linkClick} >View All</Link>
        </div>
        <Carousel duration={this.props.duration} siteurl={this.props.context.pageContext.web.absoluteUrl}
          employeesReward={this.state.employeesReward} WebpartTitle={this.props.WebpartTitle}
          employeesRewardCount={Number(this.state.employeesReward.length)}
          isAutoRotate={this.props.isAutorotate}
          height={this.props.height}
          width={this.props.width}
          columnSection={this.props.ColumnSection}
          showCaptions={true}></Carousel>
      </section>
    );
  }
}
