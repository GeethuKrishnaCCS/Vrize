import * as React from "react";
import styles from "./PublicHolidays.module.scss";
import type { IPublicHolidaysProps } from "./IPublicHolidaysProps";
import { HolidayCard } from "./HolidayCard";
import { IPublicHoliday, PublicHolidaysService } from "./../../../shared/services/PublicHolidaysService"
import { IEventLinksConfig } from "../types/Types";


interface PublicHolidaysState {
  country: string;
  nextHoliday: IPublicHoliday | null;
  upcomingHolidays: IPublicHoliday[];
  loading: boolean;
  listURLWithFilter: string;
}

export default class PublicHolidays extends React.Component<IPublicHolidaysProps, PublicHolidaysState> {
  private _Service: PublicHolidaysService;

  constructor(props: IPublicHolidaysProps) {
    super(props);
    this.state = {
      country: "",
      nextHoliday: null,
      upcomingHolidays: [],
      loading: true,
      listURLWithFilter: ""
    };

    this._Service = new PublicHolidaysService(this.props.context);
  }

  async componentDidMount(): Promise<void> {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      this.setState({ country: data.country_name });
      await this.fetchHolidays(data.country_name);
    } catch (error) {
      console.error("Error fetching location:", error);
      await this.fetchHolidays("United States");
    }
  }

  private getEventCalendarLink = (country: string): string => {
    const calendarLinks: IEventLinksConfig = this.props.eventLinksConfig;
    return calendarLinks[country];
  };
  fetchHolidays = async (countryCode: string): Promise<void> => {
    try {
      const limitToDate: Date | undefined = this.props.limitDate ? new Date(this.props.limitDate) : undefined;

      const listName = this.props.listName;
      const holidays: IPublicHoliday[] = await this._Service.getUpcomingPublicHolidaysByTitle(
        listName,
        countryCode,
        limitToDate,
        5
      );

      const futureHolidays: IPublicHoliday[] = holidays

      this.setState({
        nextHoliday: futureHolidays.length > 0 ? futureHolidays[0] : null,
        upcomingHolidays: futureHolidays.slice(1, 5),
        loading: false,

      });
    } catch (error) {
      console.error("Error fetching holidays:", error);
      this.setState({ loading: false });
    }
  };

  render(): React.ReactElement<IPublicHolidaysProps> {
    const { hasTeamsContext } = this.props;
    const { nextHoliday, loading } = this.state;

    if (loading) {
      return (
        <section className={`${styles.publicHolidays} ${hasTeamsContext ? styles.teams : ''}`}>

          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        </section>
      );
    }

    return (
      <section className={`${styles.publicHolidays} ${hasTeamsContext ? styles.teams : ''}`}>
        {nextHoliday && <HolidayCard filteredListUrl={this.props.context.pageContext.site.absoluteUrl + this.getEventCalendarLink(this.state.country)} {...nextHoliday} webpartTitle={this.props.webpartTitle} />}
        {/* {upcomingHolidays.length > 0 && (
          <UpcomingHolidays holidays={upcomingHolidays} />
        )} */}
      </section>
    );
  }
}
