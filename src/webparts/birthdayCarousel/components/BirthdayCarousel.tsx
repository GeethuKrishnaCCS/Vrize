import * as React from 'react';
import styles from './BirthdayCarousel.module.scss';
import type { IBirthdayCarouselProps, IBirthdayCarouselState } from './IBirthdayCarouselProps';
import { IIconProps, IconButton, Link } from '@fluentui/react';
import * as moment from 'moment';
import { BaseService } from '../../../shared/services/BaseService';

export default class BirthdayCarousel extends React.Component<IBirthdayCarouselProps, IBirthdayCarouselState, {}> {
  private service: BaseService; /* To call the service file */
  public constructor(props: IBirthdayCarouselProps) {
    super(props);
    this.state = {
      listItems: [],
      today: "",
      greetings: [],
      currentIndex: 0,
      itemsPerPage: this.props.NoOfItemDisplay !== "" ? parseInt(this.props.NoOfItemDisplay) : 3,
    }
    const siteURL = window.location.protocol + "//" + window.location.hostname + this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);
    this.getBirthdayDetail = this.getBirthdayDetail.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
    this.handleScrollDown = this.handleScrollDown.bind(this);
    this.getEmployeeDetail = this.getEmployeeDetail.bind(this);
    this.onViewAll = this.onViewAll.bind(this);
  }
  public async componentDidMount() {
    await this.getBirthdayDetail();
  }
  public async getBirthdayDetail() {
    try {
      const url: string = this.props.context.pageContext.web.serverRelativeUrl;
      const listItem = await this.service.getItemSelectExpandOrderBy(
        url,
        this.props.birthdayListName,
        "*, Employee/ID, Employee/Title, Employee/EMail, Birthday",
        "Employee",
        "Birthday"
      );
      // Calculate the start date (today) and end date (14 days from today)
      const today = moment();
      const endDate = today.clone().add(14, 'days');
      // Filter employees whose birthday falls within the next 14 days
      const birthdayList = listItem.filter((item: any) => {
        if (item.Birthday) {
          const birthdayThisYear = moment(item.Birthday).year(today.year());
          return birthdayThisYear.isBetween(today, endDate, 'days', '[]');
        }
        return false;
      });

      this.setState({ greetings: birthdayList });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  public onViewAll() {
    const rewardsandbirthdaylink = this.props.context.pageContext.web.serverRelativeUrl +
      "/SitePages/Birthdays.aspx";
    window.open(rewardsandbirthdaylink, "_blank", "noopener,noreferrer");
  }
  private handleScrollUp() {
    const newIndex = Math.max(this.state.currentIndex - this.state.itemsPerPage, 0);
    this.setState({ currentIndex: newIndex });
  }
  private handleScrollDown() {
    const newIndex = Math.min(this.state.currentIndex + this.state.itemsPerPage, this.state.greetings.length - 1);
    this.setState({ currentIndex: newIndex });
  }
  public getEmployeeDetail(name: string, email: string) {
    const defaultImage = this.props.DefaultGalleryUrl;
    const personImage = email
      ? `${this.props.context.pageContext.web.absoluteUrl.replace(this.props.context.pageContext.web.serverRelativeUrl, '')}/_layouts/15/userphoto.aspx?size=L&accountname=${email}`
      : defaultImage;

    return {
      displayName: name,
      mail: email,
      personImage: personImage || defaultImage
    };
  }
  public render(): React.ReactElement<IBirthdayCarouselProps> {
    const ChevronUp: IIconProps = { iconName: 'ChevronUp' };
    const ChevronDown: IIconProps = { iconName: 'ChevronDown' };

    const { greetings, currentIndex, itemsPerPage } = this.state;
    const displayedItems = greetings.slice(currentIndex, currentIndex + itemsPerPage);
    return (
      <div className={`${styles.birthdayCarousel}`}>
        <div>
          <div className={styles.birthdayViewallAlign}>
            <div className={styles.defaultBirthdayLabel}>{this.props.webpartName}</div>
            <div>
              <Link onClick={this.onViewAll} className={styles.viewAll}>
                View All
              </Link>
            </div>
          </div>

          <div className={styles.box}>
            <div className={styles.uparrow}>
              <IconButton
                iconProps={ChevronUp}
                ariaLabel="Scroll up"
                onClick={this.handleScrollUp}
                disabled={this.state.currentIndex === 0}
                className={styles.customIconButton}
              />
            </div>

            <div className={styles.employee}>
              {displayedItems.length > 0 ? (
                displayedItems.map((item: any, index: any) => (
                  <div className={styles.persondiv} key={index}>

                    <div className={styles.Profilecard}>
                      <div className={styles.ImgContainer}>
                        <img
                          // src={this.getEmployeeDetail(item.Employee.Title, item.Employee.EMail, item.ImageLink?.Url).personImage}
                          src={this.getEmployeeDetail(item.Employee.Title, item.Employee.EMail).personImage}
                          className={styles.Image}
                          alt={`Profile picture of ${item.Employee.Title}`}
                        />
                      </div>

                      <div className={styles.secondarycard}>
                        <div className={styles.Namecard}>{item.Employee.Title}</div>
                        <div className={styles.secondarytextstyle}>
                          Birthday on {moment(item.Birthday).format('MMM DD')}
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div>{"No Birthday Today"}</div>
              )}
            </div>

            <div className={styles.downarrow}>
              <IconButton
                iconProps={ChevronDown}
                ariaLabel="Scroll down"
                onClick={this.handleScrollDown}
                disabled={this.state.currentIndex >= this.state.greetings.length - this.props.NoOfItemDisplay}
                className={styles.customIconButton}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
