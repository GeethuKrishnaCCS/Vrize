import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import * as moment from "moment";
import { IIconProps, IconButton, mergeStyles } from "@fluentui/react";
import styles from './Birthday.module.scss';
export const iconClass = mergeStyles({
  fontSize: 15,
  height: 15,
  width: 15,
});

export default class StackStyle extends React.Component<
  StylingProps,
  StylingState
> {
  constructor(props: StylingProps) {
    super(props);
    this.state = {
      Employees: [],
      RenderedEmployees: [],
      UpdateCount: 0,
      Next: 3,
      Count: 1,
      Reload: true
    };
  }



  public componentDidMount() {
    const array: any[] = [];
    let count = 0;
    const min = 0;
    const max = min + 3;
    this.props.employeesBirthday.map(Post => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    this.setState({ RenderedEmployees: array, Next: 3, Count: 1, UpdateCount: 0 });
  }

  public formatDateTime(dateTime: any) {
    const formattedDate = moment(dateTime).format('MMM DD, YYYY');
    const formattedTime = moment(dateTime).format('h:mm a');
    const timezone = moment(dateTime).format('z');
    return `${formattedDate} at ${formattedTime} ${timezone}`;
  }

  public componentDidUpdate(prevProps: StylingProps) {
    const array: any[] = [];
    let count = 0;
    const min = 0;
    const max = min + 4;
    if (prevProps.employeesBirthday !== this.props.employeesBirthday) {

      this.props.employeesBirthday.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedEmployees: array, Next: 4, Count: 1, UpdateCount: 0 });
      return true;
    }
    else if (this.props.employeesBirthday.length > 0 && this.props.employeesBirthday.length > this.state.RenderedEmployees.length && this.state.UpdateCount < 4) {
      this.props.employeesBirthday.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedEmployees: array, Next: 3, Count: 1, UpdateCount: this.state.UpdateCount + 1 });
      return true;
    }
  }
  public Next(Employees: any) {
    const array: any[] = [];
    let count = 0;
    const min = this.state.Next;
    const max = min + 4;
    Employees.map((Post: any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next + 3;
    this.setState({ RenderedEmployees: array, Next: newVal, Count: this.state.Count + 1 });
  }

  public Back(Employees: any) {
    const array: any[] = [];
    const min = this.state.Next - 6;
    const max = this.state.Next - 2;
    let count = 0;
    Employees.map((Post: any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next - 3;
    this.setState({ RenderedEmployees: array, Next: newVal, Count: this.state.Count - 1 });
  }
  public renderdots() {
    const dotCount = Math.ceil(this.props.employeesBirthday.length / 3);
    const dots = [];

    for (let i = 0; i < dotCount; i++) {
      if (i === this.state.Count - 1) {
        dots.push(
          <div key={i} className={`${styles.Dot} ${styles.active}`}>
            <div className={styles.InnerDot}></div>
          </div>
        );
      }
      else {
        dots.push(
          <div key={i} className={styles.Dot}>
            <div className={styles.InnerDot}></div>
          </div>
        );
      }
    }

    return <div className={styles.NavDot}>{dots}</div>;

  }
  public render(): React.ReactElement<StylingProps> {
    let i = 0;
    const backicon: IIconProps = { iconName: 'ChevronLeftSmall' };
    const nexticon: IIconProps = { iconName: 'ChevronRightSmall' };
    return (
      <div className={styles.StackStyle}>
        <div className={styles.StackStyleContainer}>
          <div className={styles.BirthdaySlider}>
            <div className={styles.Prevbtn}>
              <IconButton iconProps={backicon}
                onClick={() => this.Back(this.props.employeesBirthday)} disabled={this.state.Next === 3}
                className={styles.NavigationLeftButtonStyling}
                ariaLabel={"Back"} />
            </div>
            <div className={styles.BirthdayCard}>
              {this.state.RenderedEmployees.map((emp, key) => {
                i = i + 1;
                return (
                  <div className={styles.card}>
                    <div className={styles.date}>
                      {"On " + moment(new Date()).format("DD/MM/YYYY")}
                    </div>
                    <div className={styles.images}>
                      <em className={styles.innerring}>
                        <svg width="78" height="115" viewBox="0 0 78 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M57.5 113.5C26.5721 113.5 1.5 88.4279 1.5 57.5C1.5 26.5721 26.5721 1.5 57.5 1.5C63.7491 1.5 69.7592 2.52359 75.3716 4.41225C76.0741 4.11909 76.7837 3.83946 77.5 3.5737C71.2711 1.26268 64.533 0 57.5 0C25.7436 0 0 25.7436 0 57.5C0 89.2564 25.7436 115 57.5 115C64.533 115 71.2711 113.737 77.5 111.426C76.7837 111.161 76.0741 110.881 75.3716 110.588C69.7592 112.476 63.7491 113.5 57.5 113.5Z" fill="#541A21" />
                        </svg>
                      </em>
                      <em className={styles.outerring}>
                        <svg width="138" height="135" viewBox="0 0 138 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M45.9885 0.93042C19.1951 10.4059 0 35.9614 0 66.0001C0 82.6726 5.91329 97.964 15.757 109.891L16.249 108.118C7.01886 96.5728 1.5 81.931 1.5 66.0001C1.5 36.9867 19.805 12.2486 45.4961 2.70482L45.9885 0.93042ZM75.6015 133.181C109.783 129.864 136.5 101.052 136.5 66.0001C136.5 54.5911 133.669 43.8432 128.672 34.4204L129.523 32.8376C134.927 42.6786 138 53.9805 138 66.0001C138 102.171 110.168 131.841 74.7512 134.764L75.6015 133.181Z" fill="#5D5B5B" />
                        </svg>
                      </em>
                      <img className={styles.imgWidth}
                        src={emp.ImageURL ?? ''}
                        alt="Image" /></div>
                    <div className={styles.name}>
                      {emp.FullName}
                    </div>
                    <div className={styles.designation}>
                      {emp.Designation}
                    </div>

                  </div>

                );
              })}
            </div>
            <div className={styles.Nextbtn}>
              <IconButton iconProps={nexticon}
                onClick={() => this.Next(this.props.employeesBirthday)}
                disabled={this.state.Next >= this.props.employeesBirthday.length}
                className={styles.NavigationRightButtonStyling}
                ariaLabel={"Next"} />
            </div>
          </div>

          <div>
            {this.renderdots()}
          </div>
        </div>
      </div>
    );
  }
}
