import * as React from "react";
import styles from "./Birthday.module.scss";
import type { IBirthdayProps, IBirthdayState } from "./IBirthdayProps";
import { BaseService } from "../../../shared/services/BaseService";
import StackStyle from "./StackStyle";

export default class Birthday extends React.Component<
  IBirthdayProps,
  IBirthdayState,
  {}
> {
  private service: BaseService; /* To call the service file */
  constructor(props: IBirthdayProps) {
    super(props);
    this.state = {
      currentUser: {
        id: "",
        email: "",
        title: "",
      },
      modaloverlay: { isOpen: false, modalText: "" },
      employeesBirthday: [],
      Reload: false

    };
    const siteURL =
      window.location.protocol +
      "//" +
      window.location.hostname +
      this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);
    this.getEmployeeDatas = this.getEmployeeDatas.bind(this);

  }
  public async componentDidMount() {
    const user = await this.service.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: {
          id: user.Id,
          email: user.Email,
          title: user.Title,
        },
        modaloverlay: { isOpen: true, modalText: "Loading..." },
      });
      await this.getEmployeeDatas();

    }
  }

  private async getEmployeeDatas() {
    let imageurl: any;
    const queryurl =
      this.props.context.pageContext.web.serverRelativeUrl +
      "/Lists/" +
      this.props.birthdayListName;
    const selectquery = "*,Birthday,Employee/ID,Employee/Title,Employee/EMail";
    const expandquery = "Employee";
    const employeeData = await this.service.getItemsSelectExpand(
      queryurl,
      selectquery,
      expandquery
    );
    if (employeeData) {
      const EmployeeDetails: any[] = [];
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0"); // Get the day and pad with leading zero if needed
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed, so add 1) and pad with leading zero
      const formattedTodayDate = `${day}-${month}`;
      console.log("formattedTodayDate: ", formattedTodayDate);
      for (let i = 0; i < employeeData.length; i++) {
        const item = employeeData[i];
        const dateOfBirth = new Date(item.Birthday);
        const day = String(dateOfBirth.getDate()).padStart(2, "0"); // Get the day and pad with leading zero if needed
        const month = String(dateOfBirth.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed, so add 1) and pad with leading zero
        const formattedBirthDate = `${day}-${month}`;
        console.log("formattedBirthDate: ", formattedBirthDate);
        if (item.ImageLink === null) {
          const queryURL =
            this.props.context.pageContext.web.serverRelativeUrl +
            "/" +
            this.props.defaultLibraryName;
          const selectquery = "*,FileRef,FileLeafRef";
          const imagedoc = await this.service.getImageItems(
            queryURL,
            selectquery
          );
          console.log(imagedoc);
          for (let i = 0; i < imagedoc.length; i++) {
            const image = imagedoc[i];
            if (image.DefaultType === "Default") {
              imageurl = image.FileRef;
            }
          }
        } else {
          imageurl = item.ImageLink.Url;
        }

        if (formattedBirthDate === formattedTodayDate) {
          EmployeeDetails.push({
            ImageURL: imageurl,
            Designation: item.Designation,
            FullName: item.EmployeeName,
            Birthday: item.Birthday,
          });
        }
      }
      console.log("greetings: ", EmployeeDetails);
      this.setState({
        employeesBirthday: EmployeeDetails,
      });
    }
  }


  public render(): React.ReactElement<IBirthdayProps> {

    return (
      <section className={`${styles.birthday}`}>
        <div className={styles.heading}>
          <h1 className={styles.pagetitle}>{this.props.WebpartTitle}</h1>
        </div>

        {this.state.employeesBirthday.length > 0 && <StackStyle
          employeesBirthday={this.state.employeesBirthday}
          Reload={this.state.Reload}
          context={this.props.context}
          WebpartTitle={this.props.WebpartTitle} />}
        {this.state.employeesBirthday.length === 0 &&
          <div className={styles.nobirthday}>
            No Birthdays
          </div>}

      </section>
    );
  }
}
