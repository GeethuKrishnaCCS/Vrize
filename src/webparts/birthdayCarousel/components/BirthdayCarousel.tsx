import * as React from 'react';
import styles from './BirthdayCarousel.module.scss';
import type { IBirthdayCarouselProps, IBirthdayCarouselState } from './IBirthdayCarouselProps';
import { IIconProps, IconButton, Link, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets } from '@fluentui/react';
import { BaseService } from '../../../shared/services/BaseService';
import * as moment from 'moment';
import { MSGraphClientV3 } from '@microsoft/sp-http';
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
      showGreetingsModal: false,
      greetingsMail: "",
      greetingsName: "",
      heading: this.props.heading,
      headingColor: "#" + this.props.headingColor, // Default color for heading
      body: this.props.body,
      bodyColor: "#" + this.props.bodyColor // Default color for message

    }
    const siteURL = window.location.protocol + "//" + window.location.hostname + this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);
    this.getBirthdayDetail = this.getBirthdayDetail.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
    this.handleScrollDown = this.handleScrollDown.bind(this);
    this.getEmployeeDetail = this.getEmployeeDetail.bind(this);
    this.onViewAll = this.onViewAll.bind(this);
    this.handleSendGreetings = this.handleSendGreetings.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onConfirmSend = this.onConfirmSend.bind(this);
    this.messageChange = this.messageChange.bind(this);
    this.sendmail = this.sendmail.bind(this);

  }
  public async componentDidMount() {
    await this.getBirthdayDetail();
  }

  public async getBirthdayDetail() {
    try {
      const queryurl =
        this.props.context.pageContext.web.serverRelativeUrl +
        "/Lists/" +
        this.props.birthdayListName;

      const listItem = await this.service.getBirthdayCarouselItemSelectExpandOrderBy(
        queryurl,
        "*, Employee/ID, Employee/Title, Employee/EMail, Birthday, BirthdayText",
        "Employee",
        "Birthday"
      );
      console.log('listItem: ', listItem);



      const sortedUsersAsc = [...listItem].sort((a, b) => new Date(a.BirthdayText).getTime() - new Date(b.BirthdayText).getTime());
      console.log('sortedUsersAsc: ', sortedUsersAsc);
      this.setState({ greetings: sortedUsersAsc });

      console.log('greetings: ', this.state.greetings);
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
    const personImage = `${this.props.context.pageContext.web.absoluteUrl.replace(this.props.context.pageContext.web.serverRelativeUrl, '')}/_layouts/15/userphoto.aspx?size=L&accountname=${email}`
      ;

    return {
      displayName: name,
      mail: email,
      personImage: personImage
    };
  }
  public handleSendGreetings(item: any) {
    console.log('item: ', item.Employee.EMail);
    this.setState({ showGreetingsModal: true, greetingsMail: item.Employee.EMail, greetingsName: item.Employee.Title });
  }
  private closeModal() {
    this.setState({ showGreetingsModal: false, body: '' });
  }
  public messageChange = (ev: React.FormEvent<HTMLInputElement>, body?: string) => {
    this.setState({ body: body || '', });
  }
  public async onConfirmSend() {
    this.setState({ showGreetingsModal: false, body: this.props.body });

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
      const items = await this.service.getdefaultImage(queryliburl);
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
  // Function to strip HTML tags from a string
  stripHtmlTags = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
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

    const currentUser = await this.service.getCurrentUser();
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
    await this.service.addListItem(queryurl, addgreetings)
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
  public render(): React.ReactElement<IBirthdayCarouselProps> {
    const ChevronUp: IIconProps = { iconName: 'ChevronUp' };
    const ChevronDown: IIconProps = { iconName: 'ChevronDown' };
    const { greetings, currentIndex, itemsPerPage } = this.state;
    const displayedItems = greetings.slice(currentIndex, currentIndex + itemsPerPage);
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
        border: '1px solid black',
        borderRadius: '2em',
        backgroundColor: 'skyblue',
        color: 'black',
        minHeight: '25px'
      },
    };
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
                        <div className={styles.secondarytextstyle}>{"Birthday on " + item.BirthdayText}</div>
                        {moment(item.Birthday).format('DD-MMM') === moment(new Date()).format('DD-MMM') &&
                          <div className={styles.greetbutton}>
                            <PrimaryButton iconProps={{ iconName: 'Send' }}
                              title="Send Greetings" onClick={() => this.handleSendGreetings(item)}
                              styles={customButtonStyles} >
                              Let's Wish</PrimaryButton>
                          </div>}
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
          <div >

            <Modal
              isOpen={this.state.showGreetingsModal}
              isModeless={true}
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

                <TextField id="message" autoComplete='true' label="Message" value={this.state.body} multiline
                  onChange={this.messageChange} />
                <PrimaryButton style={{ float: "right", marginTop: "7px", marginBottom: "9px" }} className={styles.modalButton} id="b2" onClick={this.onConfirmSend}>SEND</PrimaryButton >
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
