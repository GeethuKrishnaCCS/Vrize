import * as React from "react";
import styles from "./Birthday.module.scss";
import type { IBirthdayProps, IBirthdayState } from "./IBirthdayProps";
import { BaseService } from "../../../shared/services/BaseService";
import StackStyle from "./StackStyle";
import * as moment from "moment";
import * as _ from "lodash";

export default class Birthday extends React.Component<IBirthdayProps, IBirthdayState, {}> {
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
      let sorted_EmployeeDetails: any[] = [];
      const currentDate = moment(new Date()).format("DD-MM"); // Format current date as "DD-MM"
      const endDate = moment(this.props.DateEnter, "DD-MM").format("DD-MM");
      for (let i = 0; i < employeeData.length; i++) {
        const item = employeeData[i];
        const dateOfBirth = moment(item.Birthday).format("DD-MM"); // Format birthdate as "DD-MM"
        const parseDate = (dateStr: string) => {
          const [day, month] = dateStr.split('-').map(Number);
          return new Date(0, month - 1, day); // Year is irrelevant, using 0
        };
        const current = parseDate(currentDate);
        const end = parseDate(endDate);
        const birthDate = parseDate(dateOfBirth);
        // Check if the dateOfBirth is between currentDate and endDate
        if (birthDate >= current && birthDate <= end) {
          // Get employee image using getEmployeeDetail
          const employeeDetail = this.getEmployeeDetail(item.EmployeeName, item.Employee.EMail);

          EmployeeDetails.push({
            ImageURL: employeeDetail.personImage,
            Designation: item.Designation,
            FullName: item.EmployeeName,
            Birthday: item.Birthday,
          });
          this.setState({
            employeesBirthday: EmployeeDetails,
          });
        }
      }
      sorted_EmployeeDetails = _.orderBy(EmployeeDetails, 'Birthday', ['asc']);
      this.setState({
        employeesBirthday: sorted_EmployeeDetails,
      });
    }
  }
  public getEmployeeDetail(_name: string, _email: string) {
    const defaultImage = this.props.defaultLibraryName;
    const personImage = _email
      ? `${this.props.context.pageContext.web.absoluteUrl.replace(this.props.context.pageContext.web.serverRelativeUrl, '')}/_layouts/15/userphoto.aspx?size=L&accountname=${_email}`
      : defaultImage;

    return {
      displayName: _name,
      mail: _email,
      personImage: personImage || defaultImage
    };
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
          WebpartTitle={this.props.WebpartTitle}
          DateEnter={this.props.DateEnter}
        />}
        {this.state.employeesBirthday.length === 0 &&
          <div className={styles.nobirthday}>

            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.93701 41.938L15.062 49.063L19.875 46.875L10.125 37.125L7.93701 41.938Z" fill="#939191" fill-opacity="0.33" />
              <path d="M1.99902 55.001L10.25 51.25L5.75002 46.75L1.99902 55.001Z" fill="#939191" fill-opacity="0.33" />
              <path d="M53.875 37.125L44.125 46.875L48.937 49.063L56.062 41.938L53.875 37.125Z" fill="#939191" fill-opacity="0.33" />
              <path d="M58.25 46.75L53.75 51.25L62.001 55.001L58.25 46.75Z" fill="#939191" fill-opacity="0.33" />
              <path d="M12.707 32.293C12.5927 32.1788 12.4526 32.094 12.2984 32.0459C12.1443 31.9977 11.9807 31.9876 11.8218 32.0164C11.6629 32.0452 11.5133 32.112 11.3859 32.2112C11.2584 32.3104 11.1569 32.439 11.09 32.586L1.08998 54.586C1.00583 54.7713 0.980221 54.9779 1.01657 55.1781C1.05291 55.3783 1.14948 55.5627 1.29338 55.7066C1.43728 55.8505 1.62166 55.9471 1.8219 55.9834C2.02213 56.0198 2.22869 55.9941 2.41398 55.91L24.414 45.91C24.561 45.8431 24.6896 45.7416 24.7888 45.6141C24.888 45.4867 24.9548 45.3371 24.9836 45.1782C25.0124 45.0193 25.0023 44.8557 24.9541 44.7016C24.9059 44.5474 24.8211 44.4072 24.707 44.293L12.707 32.293ZM9.13498 41.721L10.435 38.852L18.145 46.562L15.276 47.862L9.13498 41.721ZM13.335 48.749L10.467 50.049L6.94698 46.529L8.24698 43.661L13.335 48.749ZM6.06298 48.477L8.52298 50.937L4.01398 52.986L6.06298 48.477ZM20.092 45.677L11.322 36.907L12.313 34.727L22.272 44.686L20.092 45.677ZM15 29C15.5933 29 16.1733 28.8241 16.6667 28.4944C17.16 28.1648 17.5446 27.6962 17.7716 27.1481C17.9987 26.5999 18.0581 25.9967 17.9423 25.4147C17.8266 24.8328 17.5409 24.2982 17.1213 23.8787C16.7017 23.4591 16.1672 23.1734 15.5853 23.0576C15.0033 22.9419 14.4001 23.0013 13.8519 23.2284C13.3038 23.4554 12.8352 23.8399 12.5056 24.3333C12.1759 24.8266 12 25.4067 12 26C12 26.7956 12.3161 27.5587 12.8787 28.1213C13.4413 28.6839 14.2043 29 15 29ZM15 25C15.1978 25 15.3911 25.0586 15.5556 25.1685C15.72 25.2784 15.8482 25.4346 15.9239 25.6173C15.9995 25.8 16.0194 26.0011 15.9808 26.1951C15.9422 26.3891 15.8469 26.5673 15.7071 26.7071C15.5672 26.847 15.3891 26.9422 15.1951 26.9808C15.0011 27.0194 14.8 26.9996 14.6173 26.9239C14.4346 26.8482 14.2784 26.72 14.1685 26.5556C14.0586 26.3911 14 26.1978 14 26C14 25.7348 14.1053 25.4804 14.2929 25.2929C14.4804 25.1054 14.7348 25 15 25ZM23.983 22.356C24.137 24.285 23.228 26.286 21.283 28.306L22.723 29.694C25.094 27.236 26.189 24.705 25.978 22.172C25.6832 19.8139 24.4692 17.6675 22.6 16.2L21.4 17.8C22.8131 18.9315 23.7378 20.5624 23.983 22.356ZM13 14C13.7956 14 14.5587 14.3161 15.1213 14.8787C15.6839 15.4413 16 16.2044 16 17C16 17.2652 16.1053 17.5196 16.2929 17.7071C16.4804 17.8946 16.7348 18 17 18C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17C18 16.2044 18.3161 15.4413 18.8787 14.8787C19.4413 14.3161 20.2043 14 21 14C21.2652 14 21.5196 13.8946 21.7071 13.7071C21.8946 13.5196 22 13.2652 22 13C22 12.7348 21.8946 12.4804 21.7071 12.2929C21.5196 12.1054 21.2652 12 21 12C20.2043 12 19.4413 11.6839 18.8787 11.1213C18.3161 10.5587 18 9.79565 18 9C18 8.73478 17.8946 8.48043 17.7071 8.29289C17.5196 8.10536 17.2652 8 17 8C16.7348 8 16.4804 8.10536 16.2929 8.29289C16.1053 8.48043 16 8.73478 16 9C16 9.79565 15.6839 10.5587 15.1213 11.1213C14.5587 11.6839 13.7956 12 13 12C12.7348 12 12.4804 12.1054 12.2929 12.2929C12.1053 12.4804 12 12.7348 12 13C12 13.2652 12.1053 13.5196 12.2929 13.7071C12.4804 13.8946 12.7348 14 13 14ZM17 12C17.2847 12.3786 17.6213 12.7153 18 13C17.6213 13.2847 17.2847 13.6214 17 14C16.7153 13.6214 16.3786 13.2847 16 13C16.3786 12.7153 16.7153 12.3786 17 12ZM62.91 54.586L52.91 32.586C52.8431 32.439 52.7415 32.3104 52.6141 32.2112C52.4866 32.112 52.3371 32.0452 52.1782 32.0164C52.0192 31.9876 51.8557 31.9977 51.7016 32.0459C51.5474 32.094 51.4072 32.1788 51.293 32.293L39.293 44.293C39.1788 44.4072 39.094 44.5474 39.0458 44.7016C38.9977 44.8557 38.9875 45.0193 39.0163 45.1782C39.0451 45.3371 39.112 45.4867 39.2112 45.6141C39.3104 45.7416 39.439 45.8431 39.586 45.91L61.586 55.91C61.7713 55.9941 61.9778 56.0198 62.1781 55.9834C62.3783 55.9471 62.5627 55.8505 62.7066 55.7066C62.8505 55.5627 62.947 55.3783 62.9834 55.1781C63.0197 54.9779 62.9941 54.7713 62.91 54.586ZM55.749 43.665L57.049 46.533L53.529 50.053L50.661 48.753L55.749 43.665ZM48.721 47.865L45.852 46.565L53.562 38.855L54.862 41.724L48.721 47.865ZM51.687 34.728L52.678 36.908L43.908 45.678L41.728 44.687L51.687 34.728ZM55.477 50.937L57.937 48.477L59.986 52.986L55.477 50.937ZM49 23C48.4066 23 47.8266 23.1759 47.3333 23.5056C46.8399 23.8352 46.4554 24.3038 46.2283 24.8519C46.0013 25.4001 45.9419 26.0033 46.0576 26.5853C46.1734 27.1672 46.4591 27.7018 46.8787 28.1213C47.2982 28.5409 47.8328 28.8266 48.4147 28.9424C48.9967 29.0581 49.5999 28.9987 50.148 28.7716C50.6962 28.5446 51.1647 28.1601 51.4944 27.6667C51.824 27.1734 52 26.5933 52 26C52 25.2044 51.6839 24.4413 51.1213 23.8787C50.5587 23.3161 49.7956 23 49 23ZM49 27C48.8022 27 48.6089 26.9414 48.4444 26.8315C48.28 26.7216 48.1518 26.5654 48.0761 26.3827C48.0004 26.2 47.9806 25.9989 48.0192 25.8049C48.0578 25.6109 48.153 25.4327 48.2929 25.2929C48.4327 25.153 48.6109 25.0578 48.8049 25.0192C48.9989 24.9806 49.1999 25.0004 49.3827 25.0761C49.5654 25.1518 49.7216 25.28 49.8315 25.4444C49.9413 25.6089 50 25.8022 50 26C50 26.2652 49.8946 26.5196 49.7071 26.7071C49.5196 26.8946 49.2652 27 49 27ZM42.72 28.306C40.772 26.286 39.863 24.285 40.02 22.356C40.2644 20.5629 41.188 18.932 42.6 17.8L42 17L41.4 16.2C39.5295 17.6683 38.315 19.8163 38.021 22.176C37.81 24.709 38.905 27.24 41.276 29.698L42.72 28.306ZM43 14C43.7956 14 44.5587 14.3161 45.1213 14.8787C45.6839 15.4413 46 16.2044 46 17C46 17.2652 46.1053 17.5196 46.2929 17.7071C46.4804 17.8946 46.7348 18 47 18C47.2652 18 47.5196 17.8946 47.7071 17.7071C47.8946 17.5196 48 17.2652 48 17C48 16.2044 48.3161 15.4413 48.8787 14.8787C49.4413 14.3161 50.2043 14 51 14C51.2652 14 51.5196 13.8946 51.7071 13.7071C51.8946 13.5196 52 13.2652 52 13C52 12.7348 51.8946 12.4804 51.7071 12.2929C51.5196 12.1054 51.2652 12 51 12C50.2043 12 49.4413 11.6839 48.8787 11.1213C48.3161 10.5587 48 9.79565 48 9C48 8.73478 47.8946 8.48043 47.7071 8.29289C47.5196 8.10536 47.2652 8 47 8C46.7348 8 46.4804 8.10536 46.2929 8.29289C46.1053 8.48043 46 8.73478 46 9C46 9.79565 45.6839 10.5587 45.1213 11.1213C44.5587 11.6839 43.7956 12 43 12C42.7348 12 42.4804 12.1054 42.2929 12.2929C42.1053 12.4804 42 12.7348 42 13C42 13.2652 42.1053 13.5196 42.2929 13.7071C42.4804 13.8946 42.7348 14 43 14ZM47 12C47.2847 12.3786 47.6213 12.7153 48 13C47.6213 13.2847 47.2847 13.6214 47 14C46.7153 13.6214 46.3786 13.2847 46 13C46.3786 12.7153 46.7153 12.3786 47 12ZM22.02 38.8L23.979 39.2C24.016 39.03 24.93 35 30 35V33C24.605 33 22.421 36.8 22.02 38.8ZM41.98 38.8C41.579 36.8 39.4 33 34 33V35C39.07 35 39.984 39.03 40.021 39.2L41.98 38.8ZM36 26C36 25.2089 35.7654 24.4355 35.3259 23.7777C34.8863 23.1199 34.2616 22.6072 33.5307 22.3045C32.7998 22.0017 31.9955 21.9225 31.2196 22.0769C30.4437 22.2312 29.731 22.6122 29.1716 23.1716C28.6121 23.731 28.2312 24.4437 28.0768 25.2196C27.9225 25.9956 28.0017 26.7998 28.3045 27.5307C28.6072 28.2616 29.1199 28.8864 29.7777 29.3259C30.4355 29.7654 31.2089 30 32 30C33.0608 30 34.0783 29.5786 34.8284 28.8284C35.5786 28.0783 36 27.0609 36 26ZM32 28C31.6044 28 31.2177 27.8827 30.8888 27.6629C30.5599 27.4432 30.3036 27.1308 30.1522 26.7654C30.0008 26.3999 29.9612 25.9978 30.0384 25.6098C30.1156 25.2219 30.3061 24.8655 30.5858 24.5858C30.8655 24.3061 31.2218 24.1156 31.6098 24.0384C31.9978 23.9613 32.3999 24.0009 32.7653 24.1522C33.1308 24.3036 33.4432 24.56 33.6629 24.8889C33.8827 25.2178 34 25.6044 34 26C34 26.5304 33.7893 27.0391 33.4142 27.4142C33.0391 27.7893 32.5304 28 32 28Z" fill="#939191" />
            </svg>

            No Birthdays
          </div>}

      </section>
    );
  }
}
