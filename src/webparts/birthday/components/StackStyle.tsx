import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import * as moment from "moment";
import { IIconProps, IconButton, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets, mergeStyles } from "@fluentui/react";
import styles from "./Birthday.module.scss";
import { MSGraphClientV3 } from '@microsoft/sp-http';
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
      Next: 5,
      Count: 1,
      Reload: true,
      showGreetingsModal: false,
      greetingsMail: "",
      greetingsName: "",
      heading: this.props.heading,
      headingColor: "#" + this.props.headingColor, // Default color for heading
      body: this.props.body || '',
      bodyColor: "#" + this.props.bodyColor, // Default color for message
      buttonColor: "#" + this.props.buttonColor // Default color for button
    };
    this.handleSendGreetings = this.handleSendGreetings.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.messageChange = this.messageChange.bind(this);
    this.onConfirmSend = this.onConfirmSend.bind(this);
    this.sendmail = this.sendmail.bind(this);
  }



  public componentDidMount() {
    const array: any[] = [];
    let count = 0;
    const min = 0;
    const max = min + 5;
    this.props.employeesBirthday.map(Post => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    this.setState({ RenderedEmployees: array, Next: 5, Count: 1, UpdateCount: 0 });

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
    const max = min + 6;
    if (prevProps.employeesBirthday !== this.props.employeesBirthday) {

      this.props.employeesBirthday.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedEmployees: array, Next: 6, Count: 1, UpdateCount: 0 });
      return true;
    }
    else if (this.props.employeesBirthday.length > 0 && this.props.employeesBirthday.length > this.state.RenderedEmployees.length && this.state.UpdateCount < 4) {
      this.props.employeesBirthday.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedEmployees: array, Next: 5, Count: 1, UpdateCount: this.state.UpdateCount + 1 });
      return true;
    }
  }
  public Next(Employees: any) {
    const array: any[] = [];
    let count = 0;
    const min = this.state.Next;
    const max = min + 6;
    Employees.map((Post: any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next + 5;
    this.setState({ RenderedEmployees: array, Next: newVal, Count: this.state.Count + 1 });
  }

  public Back(Employees: any) {
    const array: any[] = [];
    const min = this.state.Next - 10;
    const max = this.state.Next - 4;
    let count = 0;
    Employees.map((Post: any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next - 5;
    this.setState({ RenderedEmployees: array, Next: newVal, Count: this.state.Count - 1 });
  }
  public renderdots() {
    const dotCount = Math.ceil(this.props.employeesBirthday.length / 5);
    return <div className={styles.NavDot}>{this.state.Count} of {dotCount}</div>;

  }
  public handleSendGreetings(item: any) {
    console.log('item: ', item.EmployeeEmail);
    this.setState({ showGreetingsModal: true, greetingsMail: item.EmployeeEmail, greetingsName: item.EmployeeName, body: this.props.body });
  }
  private closeModal() {
    this.setState({ showGreetingsModal: false, body: '' });
  }
  // public messageChange = (ev: React.FormEvent<HTMLInputElement>, body?: string) => {
  //   this.setState({ body: body || '', });
  // }
  public messageChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    console.log('New value:', newValue);
    this.setState({ body: newValue || '' });
  };

  public async onConfirmSend() {
    // this.setState({ showGreetingsModal: false, body: this.props.body });
    await this.setState({ showGreetingsModal: false, body: this.state.body });
    await this.sendmail();
  }

  // Function to get the birthday image URL
  public async getBirthdayImage() {
    try {
      const queryliburl =
        this.props.context.pageContext.web.serverRelativeUrl +
        "/" + this.props.DefaultGalleryName;
      const siteUrl = this.props.context.pageContext.web.absoluteUrl;
      const tenantUrl = siteUrl.split('/sites/')[0]; // Extract tenant URL
      const items = await this.props.Service.getdefaultImage(queryliburl);
      console.log('items: ', items);
      if (items.length > 0) {
        return `${tenantUrl}${items[0].FileRef}`; // Using FileRef as the image URL
      } else {
        console.error("No birthday images found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching birthday image:", error);
      return null;
    }
  }
  //Send Mail
  public sendmail = async () => {
    const imageUrl = await this.getBirthdayImage();

    if (!imageUrl) {
      console.error("Failed to get birthday image.");
      return;
    }
    //Create Subject for Email
    let subject = this.props.heading;
    let FinalBody = `
    <p> Dear ${this.state.greetingsName},</p>
  <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-image: url('${imageUrl}'); background-size: cover; padding: 20px; border-radius: 10px;">
          <h1 style="color: ${this.state.headingColor};">${this.props.heading}</h1>
          <p style="color: ${this.state.bodyColor}; font-style: italic;">${this.state.body}</p>
        </div>
      </div>
    `;

    const currentUser = await this.props.Service.getCurrentUser();
    const addgreetings = {
      Title: currentUser.Email,
      GreetingsName: this.state.greetingsName,
      GreetingsEmail: this.state.greetingsMail,
      From: currentUser.Title,
      ImageUrl: imageUrl,
      Heading: this.props.heading,
      Body: this.state.body,
      HeadingColor: this.state.headingColor,
      BodyColor: this.state.bodyColor
    }
    const queryurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.GreetingsListName;
    await this.props.Service.addListItem(queryurl, addgreetings)
    //Create Body for Email  
    let emailPostBody: any = {
      "message": {
        "subject": subject,
        "body": {
          "contentType": "HTML",
          "content": FinalBody

        },
        "toRecipients": [
          {
            "emailAddress": {
              "address": this.state.greetingsMail
            }
          }
        ],
      }
    };

    //Send Email uisng MS Graph  

    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((client: MSGraphClientV3): void => {
        client
          .api('/me/sendMail')
          .post(emailPostBody);

      });


  }
  public render(): React.ReactElement<StylingProps> {
    let i = 0;
    const backicon: IIconProps = { iconName: 'ChevronLeftSmall' };
    const nexticon: IIconProps = { iconName: 'ChevronRightSmall' };
    const cancelIcon: IIconProps = { iconName: 'Cancel' };
    const contentStyles = mergeStyleSets({
      container: {
        width: "20%",
        marginLeft: "8%",
        borderRadius: "1em"
      }
    });
    const theme = getTheme();
    const iconButtonStyles = {
      root: {
        color: theme.palette.neutralPrimary,
        marginTop: '4px',
        marginRight: '4px',
        width: '25px',
        height: '25px',
        float: "right",
        cursor: "pointer"

      },
      rootHovered: {
        color: theme.palette.neutralDark,
      },
    };
    const customButtonStyles = {
      root: {
        backgroundColor: this.state.buttonColor,
        color: 'whitesmoke',
        minHeight: '25px',
        boxSizing: 'unset',
        border: `1px solid ${this.state.buttonColor}`,
      },
    };
    return (
      <div className={styles.StackStyle}>
        <div className={styles.StackStyleContainer}>
          <div className={styles.BirthdaySlider}>
            <div className={styles.Prevbtn}>
              <IconButton iconProps={backicon}
                onClick={() => this.Back(this.props.employeesBirthday)} disabled={this.state.Next === 5}
                className={styles.NavigationLeftButtonStyling}
                ariaLabel={"Back"} />
            </div>
            <div className={styles.BirthdayCard}>
              {this.state.RenderedEmployees.map((emp, key) => {
                console.log('emp: ', emp);
                i = i + 1;
                return (
                  <div className={styles.card}>
                    <div className={styles.date}>
                      {/* {"On " + moment(emp.Birthday).format("DD/MM")} */}
                      {"On " + moment(emp.BirthdayText).format("DD/MM")}
                      {/* { "On " + emp.BirthdayText} */}
                    </div>
                    <div className={styles.images}>
                      {/* <em className={styles.innerring}>
                        <svg width="78" height="115" viewBox="0 0 78 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M57.5 113.5C26.5721 113.5 1.5 88.4279 1.5 57.5C1.5 26.5721 26.5721 1.5 57.5 1.5C63.7491 1.5 69.7592 2.52359 75.3716 4.41225C76.0741 4.11909 76.7837 3.83946 77.5 3.5737C71.2711 1.26268 64.533 0 57.5 0C25.7436 0 0 25.7436 0 57.5C0 89.2564 25.7436 115 57.5 115C64.533 115 71.2711 113.737 77.5 111.426C76.7837 111.161 76.0741 110.881 75.3716 110.588C69.7592 112.476 63.7491 113.5 57.5 113.5Z" fill="#541A21" />
                        </svg>
                      </em>
                      <em className={styles.outerring}>
                        <svg width="138" height="135" viewBox="0 0 138 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M45.9885 0.93042C19.1951 10.4059 0 35.9614 0 66.0001C0 82.6726 5.91329 97.964 15.757 109.891L16.249 108.118C7.01886 96.5728 1.5 81.931 1.5 66.0001C1.5 36.9867 19.805 12.2486 45.4961 2.70482L45.9885 0.93042ZM75.6015 133.181C109.783 129.864 136.5 101.052 136.5 66.0001C136.5 54.5911 133.669 43.8432 128.672 34.4204L129.523 32.8376C134.927 42.6786 138 53.9805 138 66.0001C138 102.171 110.168 131.841 74.7512 134.764L75.6015 133.181Z" fill="#5D5B5B" />
                        </svg>
                      </em>
                      <em className={styles.dots}>
                        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="25.0306" cy="132.03" r="6.50213" transform="rotate(0.229748 25.0306 132.03)" stroke="#5F4F39" />
                          <circle cx="132.031" cy="33.0302" r="6.50213" transform="rotate(0.229748 132.031 33.0302)" stroke="#5F4F39" />
                          <circle cx="136.5" cy="6.5" r="5.97409" transform="rotate(0.229748 136.5 6.5)" stroke="#541A21" />
                          <circle cx="22.5002" cy="155.5" r="4.18206" transform="rotate(0.229748 22.5002 155.5)" stroke="#541A21" stroke-width="0.6" />
                          <circle cx="25.0162" cy="132.016" r="4" transform="rotate(0.229748 25.0162 132.016)" fill="#5F4F39" />
                          <circle cx="132.016" cy="33.016" r="4" transform="rotate(0.229748 132.016 33.016)" fill="#5F4F39" />
                          <circle cx="136.486" cy="6.48684" r="3.19835" transform="rotate(0.229748 136.486 6.48684)" fill="#541A21" stroke="#541A21" />
                          <circle cx="22.4905" cy="155.491" r="2.2604" transform="rotate(0.229748 22.4905 155.491)" fill="#541A21" stroke="#541A21" stroke-width="0.6" />
                        </svg>
                      </em> */}
                      <img className={styles.imgWidth}
                        src={emp.ImageURL || ''}
                        alt="Image" /></div>

                    <div className={styles.details}>
                      <div className={styles.name}>
                        {emp.EmployeeName}
                      </div>
                      <div className={styles.designation}>
                        {emp.Designation}
                      </div>
                    </div>

                    {/* {moment(emp.Birthday).format('DD-MMM') === moment(new Date()).format('DD-MMM') &&
                      <div className={styles.greetbutton}>
                        <PrimaryButton
                          title={this.props.buttonName} onClick={() => this.handleSendGreetings(emp)}
                          styles={customButtonStyles} >
                          {this.props.buttonName}</PrimaryButton>
                      </div>} */}


                    {new Date(emp.BirthdayText).getDate() === new Date().getDate() &&
                      new Date(emp.BirthdayText).getMonth() === new Date().getMonth() && (
                        <div className={styles.greetbutton}>
                          <PrimaryButton
                            title={this.props.buttonName}
                            onClick={() => this.handleSendGreetings(emp)}
                            styles={customButtonStyles}
                          >
                            {this.props.buttonName}
                          </PrimaryButton>
                        </div>
                      )}

                    <div>

                      <Modal
                        isOpen={this.state.showGreetingsModal}
                        containerClassName={contentStyles.container}>
                        <div style={{ padding: "18px" }}>
                          <div className={styles.modalHeading} style={{ display: "flex" }}>
                            <span style={{ textAlign: "center", display: "flex", justifyContent: "center", flexGrow: "1" }}><b>Send a special note</b></span>
                            <IconButton
                              iconProps={cancelIcon}
                              ariaLabel="Close popup modal"
                              onClick={this.closeModal}
                              styles={iconButtonStyles}
                            />
                          </div>

                          <TextField id="message2" autoComplete='true' label="Message" value={this.state.body} multiline
                            onChange={this.messageChange} />

                          <PrimaryButton style={{ float: "right", marginTop: "7px", marginBottom: "9px" }} className={styles.modalButton} id="b2" onClick={this.onConfirmSend}>SEND</PrimaryButton >
                        </div>
                      </Modal>
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
