import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import { HoverCard, HoverCardType, IIconProps, IPlainCardProps, IconButton, Persona, mergeStyles } from "@fluentui/react";
import styles from './MyTeams.module.scss';

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
      Next: 2,
      Count: 1
    };
  }



  public componentDidMount() {
    const array: any[] = [];
    let count = 0;
    const min = 0;
    const max = min + 2;
    this.props.users.map(Post => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    this.setState({ RenderedEmployees: array, Next: 2, Count: 1, UpdateCount: 0 });
  }



  public componentDidUpdate(prevProps: StylingProps) {
    const array: any[] = [];
    let count = 0;
    const min = 0;
    const max = min + 3;
    if (prevProps.users !== this.props.users) {

      this.props.users.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedEmployees: array, Next: 3, Count: 1, UpdateCount: 0 });
      return true;
    }
    else if (this.props.users.length > 0 && this.props.users.length > this.state.RenderedEmployees.length && this.state.UpdateCount < 3) {
      this.props.users.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedEmployees: array, Next: 2, Count: 1, UpdateCount: this.state.UpdateCount + 1 });
      return true;
    }
  }
  public Next(Employees: any) {
    const array: any[] = [];
    let count = 0;
    const min = this.state.Next;
    const max = min + 3;
    Employees.map((Post: any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next + 2;
    this.setState({ RenderedEmployees: array, Next: newVal, Count: this.state.Count + 1 });
  }

  public Back(Employees: any) {
    const array: any[] = [];
    const min = this.state.Next - 4;
    const max = this.state.Next - 1;
    let count = 0;
    Employees.map((Post: any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next - 2;
    this.setState({ RenderedEmployees: array, Next: newVal, Count: this.state.Count - 1 });
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
                onClick={() => this.Back(this.props.users)} disabled={this.state.Next === 2}
                className={styles.NavigationLeftButtonStyling}
                ariaLabel={"Back"} />
            </div>
            <div className={styles.RewardCard}>

              {this.state.RenderedEmployees.map((res: any) => {
                i = i + 1;
                // Define HoverCard content
                const onRenderPlainCard = (): JSX.Element => (
                  <div style={{ padding: "10px", minWidth: "200px" }}>
                    <p><strong>Email:</strong> {res.email}</p>
                    <p><strong>Contact:</strong> {res.contact || "N/A"}</p>
                  </div>
                );

                const plainCardProps: IPlainCardProps = {
                  onRenderPlainCard,
                };
                return (
                  <HoverCard
                    key={res.id}
                    cardDismissDelay={300}
                    type={HoverCardType.plain}
                    plainCardProps={plainCardProps}
                  >
                    <div className={styles.persona}>
                      <Persona
                        key={res.id} // Add a unique key for each item
                        imageUrl={res.imageURL}
                        imageInitials={res.title ? res.title.charAt(0) : 'U'}
                        text={res.title}
                        secondaryText={res.jobTitle}
                        tertiaryText={res.email}
                        hidePersonaDetails={false}
                      /></div>

                  </HoverCard>
                );
              })}


            </div>
            <div className={styles.Nextbtn}>
              <IconButton iconProps={nexticon}
                onClick={() => this.Next(this.props.users)}
                disabled={this.state.Next >= this.props.users.length}
                className={styles.NavigationRightButtonStyling}
                ariaLabel={"Next"} />
            </div>
          </div>


        </div>
      </div>
    );
  }
}
