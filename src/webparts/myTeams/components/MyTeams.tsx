import * as React from 'react';
import styles from './MyTeams.module.scss';
import type { IMyTeamsProps, IMyTeamsState } from './IMyTeamsProps';
import { BaseService } from '../../../shared/services/BaseService';
import { HoverCard, HoverCardType, IPlainCardProps, Label, Link, Persona } from '@fluentui/react';
import StackStyle from './StackStyle';

export default class MyTeams extends React.Component<IMyTeamsProps, IMyTeamsState, {}> {
  private service: BaseService;/* To call the service file */
  constructor(props: IMyTeamsProps) {
    super(props);
    this.state = {
      currentUser: {
        id: "",
        email: "",
        title: ""
      },
      managers: [],
      responders: []
    }
    const siteURL = window.location.protocol + "//" + window.location.hostname + this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);
    this.getManagers = this.getManagers.bind(this);
    this.getResponders = this.getResponders.bind(this);
    this.onViewAll = this.onViewAll.bind(this);

  }
  public async componentDidMount() {
    const user = await this.service.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: {
          id: user.Id,
          email: user.Email,
          title: user.Title
        },
      });
    }
    await this.getManagers();
    await this.getResponders();
  }
  public getManagers = async () => {
    let managerArray = []
    const manager = await this.service.getManagers(this.props.context);
    console.log(manager);
    managerArray.push({
      title: manager.displayName,
      email: manager.mail,
      jobTitle: manager.jobTitle,
      imageURL: `${this.props.context.pageContext.web.absoluteUrl.replace(this.props.context.pageContext.web.serverRelativeUrl, '')}/_layouts/15/userphoto.aspx?size=L&accountname=${manager.mail}`

    });
    this.setState({ managers: managerArray });
  }
  public getResponders = async () => {
    let responderArray = [];
    const users = await this.service.getResponders(this.props.context);
    console.log(users);
    let responders = users.value;
    for (let i = 0; i < responders.length; i++) {
      responderArray.push({
        title: responders[i].displayName,
        email: responders[i].mail,
        jobTitle: responders[i].jobTitle,
        imageURL: `${this.props.context.pageContext.web.absoluteUrl.replace(this.props.context.pageContext.web.serverRelativeUrl, '')}/_layouts/15/userphoto.aspx?size=L&accountname=${responders[i].mail}`
      });
      this.setState({ responders: responderArray });
    }

  }
  public onViewAll() {
    const rewardsandbirthdaylink =
      this.props.context.pageContext.web.absoluteUrl +
      "/SitePages/OrganisationChart.aspx";
    window.open(rewardsandbirthdaylink, "_blank", "noopener,noreferrer");
  }
  public render(): React.ReactElement<IMyTeamsProps> {

    return (
      <div className={`${styles.myTeams}`}>
        <div className={styles.heading}>
          <div className={styles.pagetitle}>{this.props.WebpartTitle}</div>
          <Link className={styles.viewAll} onClick={this.onViewAll} >View All</Link>
        </div>
        <div className={styles.box}>
          {this.state.managers.length > 0 && (
            <div>
              <Label className={styles.label}>Reports To</Label>
              {this.state.managers.map((emp: any) => {
                // Define HoverCard content
                const onRenderPlainCard = (): JSX.Element => (
                  <div style={{ padding: "10px", minWidth: "200px" }}>
                    <p><strong>Email:</strong> {emp.email}</p>
                    <p><strong>Contact:</strong> {emp.contact || "N/A"}</p>
                  </div>
                );

                const plainCardProps: IPlainCardProps = {
                  onRenderPlainCard,
                };
                return (
                  <HoverCard
                    key={emp.id}
                    cardDismissDelay={300}
                    type={HoverCardType.plain}
                    plainCardProps={plainCardProps}
                  >
                    <div className={styles.persona}>
                      <Persona
                        key={emp.id} // Add a unique key for each item
                        imageUrl={emp.imageURL}
                        imageInitials={emp.title ? emp.title.charAt(0) : 'U'}
                        text={emp.title}
                        secondaryText={emp.jobTitle}
                        tertiaryText={emp.email}
                        hidePersonaDetails={false}
                      />
                    </div>
                  </HoverCard>
                );
              })}
            </div>
          )}
          {this.state.responders.length > 0 && (
            <div>
              <Label className={styles.label}>Reporting to Me</Label>
              <StackStyle
                users={this.state.responders}
                context={this.props.context}
                WebpartTitle={this.props.WebpartTitle} />

            </div>
          )}
        </div>
      </div>
    );
  }
}
