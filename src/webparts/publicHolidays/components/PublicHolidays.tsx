import * as React from "react";
import styles from "./PublicHolidays.module.scss";
import type { IPublicHolidaysProps } from "./IPublicHolidaysProps";
import { HolidayCard } from "./HolidayCard";
// import { UpcomingHolidays } from "./UpcomingHolidays";
import { IPublicHoliday, PublicHolidaysService } from "./../../../shared/services/PublicHolidaysService"


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

  async componentDidMount() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      this.setState({ country: data.country_name });
      await this.fetchHolidays(data.country_name);
    } catch (error) {
      console.error("Error fetching location:", error);
      await this.fetchHolidays("India");
    }
  }

  fetchHolidays = async (countryCode: string): Promise<void> => {
    try {
      const limitToDate: Date | undefined = this.props.limitDate ? new Date(this.props.limitDate) : undefined;

      const listName = this.props.listName;
      const holidays2: IPublicHoliday[] = await this._Service.getUpcomingPublicHolidaysByTitle(
        listName,
        countryCode,
        limitToDate,
        5
      );

      const futureHolidays: IPublicHoliday[] = holidays2
      // .filter(
      //   (holiday: IPublicHoliday) => new Date(holiday.Date) >= new Date()
      // );
      const listUrl = `${this.props.context.pageContext.site.absoluteUrl}/lists/${listName}/AllItems.aspx?FilterField1=OfficeLocation&FilterValue1=${countryCode}`;

      this.setState({
        nextHoliday: futureHolidays.length > 0 ? futureHolidays[0] : null,
        upcomingHolidays: futureHolidays.slice(1, 5),
        loading: false,
        listURLWithFilter: listUrl

      });
    } catch (error) {
      console.error("Error fetching holidays:", error);
      this.setState({ loading: false });
    }
  };

  render() {
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
        {nextHoliday && <HolidayCard filteredListUrl={this.state.listURLWithFilter} {...nextHoliday} />}
        {/* {upcomingHolidays.length > 0 && (
          <UpcomingHolidays holidays={upcomingHolidays} />
        )} */}
      </section>
    );
  }
}
