import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import * as moment from "moment";
import { IIconProps, IconButton, mergeStyles } from "@fluentui/react";
import styles from './Rewards.module.scss';
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
    this.props.employeesReward.map(Post => {
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
    if (prevProps.employeesReward !== this.props.employeesReward) {

      this.props.employeesReward.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedEmployees: array, Next: 4, Count: 1, UpdateCount: 0 });
      return true;
    }
    else if (this.props.employeesReward.length > 0 && this.props.employeesReward.length > this.state.RenderedEmployees.length && this.state.UpdateCount < 4) {
      this.props.employeesReward.map(Post => {
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
    const dotCount = Math.ceil(this.props.employeesReward.length / 3);
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



          <div className={styles.RewardSlider}>
            <div className={styles.Prevbtn}>
              <IconButton iconProps={backicon}
                onClick={() => this.Back(this.props.employeesReward)} disabled={this.state.Next === 3}
                className={styles.NavigationLeftButtonStyling}
                ariaLabel={"Back"} />
            </div>
            <div className={styles.RewardCard}>
              {this.state.RenderedEmployees.map((emp, key) => {
                i = i + 1;
                return (
                  <div className={styles.card}>
                    <div className={styles.year}>{emp.Year}</div>
                    <div className={styles.cardContent}>
                      <img className={styles.imgWidth}
                        src={emp.ImageURL ?? ''}
                        alt="Image" />

                      <div className={styles.details}>
                        <div className={styles.name}>
                          {emp.FullName}
                        </div>
                        <div className={styles.designation}>
                          {emp.Designation}
                        </div>
                      </div>
                    </div>

                  </div>

                );
              })}
            </div>
            <div className={styles.Nextbtn}>
              <IconButton iconProps={nexticon}
                onClick={() => this.Next(this.props.employeesReward)}
                disabled={this.state.Next >= this.props.employeesReward.length}
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
