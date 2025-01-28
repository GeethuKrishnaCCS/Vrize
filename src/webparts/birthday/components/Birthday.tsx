import * as React from 'react';
import styles from './Birthday.module.scss';
import type { IBirthdayProps, IBirthdayState } from './IBirthdayProps';
import { BaseService } from '../../../shared/services/BaseService';

export default class Birthday extends React.Component<IBirthdayProps, IBirthdayState, {}> {
  private service: BaseService;/* To call the service file */
  constructor(props: IBirthdayProps) {
    super(props);
    this.state = {
      currentUser: {
        id: "",
        email: "",
        title: ""
      },
      modaloverlay: { isOpen: false, modalText: "" },
      employeeData: [],
      birthdaygreetings: []
    }
    const siteURL = window.location.protocol + "//" + window.location.hostname + this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);

  }
  public async componentDidMount() {
    const user = await this.service.getCurrentUser();
    if (user) {

      const loginName = await this.service.getUser(user.Id);
      if (loginName) {
        const result = await this.service.gettingUserProfiles(loginName.LoginName)
        if (result) {
          console.log("designation", result);
        }
      }

      // this.setState({
      //   currentUser: {
      //     id: user.Id,
      //     email: user.Email,
      //     title: user.Title
      //   },
      //   modaloverlay: { isOpen: true, modalText: "Loading..." }
      // });
      // await this.getEmployeeDatas();
    }
  }
  // private async getEmployeeDatas() {
  //   const queryurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.listName;
  //   const employeeData = await this.service.getListItems(queryurl);
  //   if (employeeData) {
  //     console.log('listItem: ', employeeData);
  //     this.setState({ employeeData: employeeData });

  //     const greetings: any[] = [];
  //     const currentDate = new Date();
  //     const todayDate = currentDate.toLocaleDateString('en-GB');

  //     const greetingsPromises = employeeData.map(async (item: any) => {
  //       const dateOfBirth = new Date(item.DateOfBirth);
  //       const formattedDate = dateOfBirth.toLocaleDateString('en-GB');

  //       const employeeInfo = await this.service.getUser(item.Employee.ID);

  //       if (formattedDate === todayDate) {
  //         greetings.push({ ...item, type: 'Birthday', employeeInfo });
  //       }

  //     });

  //     await Promise.all(greetingsPromises);

  //     this.setState({
  //       birthdaygreetings: greetings
  //     })
  //   }
  // }
  public render(): React.ReactElement<IBirthdayProps> {


    return (
      <section className={`${styles.birthday}`}>

      </section>
    );
  }
}
