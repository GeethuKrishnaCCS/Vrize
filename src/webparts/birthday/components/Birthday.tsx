import * as React from 'react';
import styles from './Birthday.module.scss';
import type { IBirthdayProps, IBirthdayState } from './IBirthdayProps';
import { BaseService } from '../../../shared/services/BaseService';
import StackStyle from './StackStyle';
import { ActionButton, DatePicker, FontWeights, IIconProps, IconButton, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets } from '@fluentui/react';
import * as moment from 'moment';

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
      employeesBirthday: [],
      Reload: false,
      openAddFormModal: false,
      name: "",
      designation: "",
      dateOfBirth: null,
      selectedFile: null,
      isAdmin: false
    }
    const siteURL = window.location.protocol + "//" + window.location.hostname + this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);
    this.getEmployeeDatas = this.getEmployeeDatas.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onAddForm = this.onAddForm.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onDesignationChange = this.onDesignationChange.bind(this);
    this.dateOfBirthChange = this.dateOfBirthChange.bind(this);
    this.onFormatDate = this.onFormatDate.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);

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
        modaloverlay: { isOpen: true, modalText: "Loading..." }
      });
      const groupName = this.props.groupName; // Replace with your group name
      const isMember = await this.isUserMemberOfGroup(groupName);
      console.log(`Is user a member of the group "${groupName}":`, isMember);
      if (isMember === true) {
        this.setState({ isAdmin: true });
        await this.getEmployeeDatas();
      }
      else {
        this.setState({ isAdmin: false });
        await this.getEmployeeDatas();
      }

    }
  }
  private async isUserMemberOfGroup(groupName: string): Promise<boolean> {
    try {
      const users = await this.service.getGroupUsers(this.props.context, groupName);
      console.log(users);
      const currentUser = await this.service.getCurrentUser();
      const userIsMember = users.some((user: any) => user.mail === currentUser.Email);
      return userIsMember;
    } catch (error) {
      console.error(`Error checking group membership: ${error}`);
      return false;
    }
  }
  private async getEmployeeDatas() {
    let imageurl: any;
    const queryurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.birthdayListName;
    const selectquery = "*,Birthday,Employee/ID,Employee/Title,Employee/EMail";
    const expandquery = "Employee";
    const employeeData = await this.service.getItemsSelectExpand(queryurl, selectquery, expandquery);
    if (employeeData) {
      const EmployeeDetails: any[] = [];
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if needed
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed, so add 1) and pad with leading zero
      const formattedTodayDate = `${day}-${month}`;
      console.log('formattedTodayDate: ', formattedTodayDate);
      for (let i = 0; i < employeeData.length; i++) {
        const item = employeeData[i];
        const dateOfBirth = new Date(item.Birthday);
        const day = String(dateOfBirth.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if needed
        const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed, so add 1) and pad with leading zero
        const formattedBirthDate = `${day}-${month}`;
        console.log('formattedBirthDate: ', formattedBirthDate);
        if (item.ImageLink === null) {
          const queryURL = this.props.context.pageContext.web.serverRelativeUrl + "/" + this.props.defaultLibraryName;
          const selectquery = "*,FileRef,FileLeafRef"
          const imagedoc = await this.service.getImageItems(queryURL, selectquery);
          console.log(imagedoc);
          for (let i = 0; i < imagedoc.length; i++) {
            const image = imagedoc[i];
            if (image.DefaultType === "Default") {
              imageurl = image.FileRef;
            }
          }
        }
        else {
          imageurl = item.ImageLink.Url
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
      console.log('greetings: ', EmployeeDetails);
      this.setState({
        employeesBirthday: EmployeeDetails
      })
    }

  }
  public onModalClose = () => {
    this.setState({ openAddFormModal: false, name: "", designation: "", dateOfBirth: null, selectedFile: null });

  }
  public onAddForm = () => {
    this.setState({ openAddFormModal: true });
  }
  public onNameChange = (event: any, name: string) => {
    if (name.trim() === "") {
      this.setState({ name: "" });
    }
    else {
      this.setState({ name: name });
    }

  }
  public onDesignationChange = (event: any, designation: string) => {
    if (designation.trim() !== "") {
      this.setState({ designation: designation });
    }
  }
  //Date of birth Change
  public dateOfBirthChange = (date?: Date): void => {
    this.setState({ dateOfBirth: date });
  }
  // On format date
  private onFormatDate = (date: Date): string => {
    const selectd = moment(date).format("DD/MM/YYYY");
    return selectd;
  }
  private uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Set the selected file
      this.setState({ selectedFile: file });
    }
  }
  public onSubmitForm = async () => {
    const formDetails = {
      EmployeeName: this.state.name,
      Designation: this.state.designation,
      Birthday: this.state.dateOfBirth

    };
    const queryListurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.birthdayListName;
    const addbdayemp = await this.service.addListItem(queryListurl, formDetails);
    const createdListItemId = addbdayemp.ID; // Assuming the response contains the created item ID
    console.log('createdItemId: ', createdListItemId);
    if (this.state.selectedFile !== null) {
      const empName = this.state.name.replace(/[^a-zA-Z0-9 ]/g, '');
      const fileName = empName + this.state.selectedFile.name.substring(this.state.selectedFile.name.lastIndexOf('.'));
      const fileResponse = await this.service.uploadDocument(`${this.props.context.pageContext.web.serverRelativeUrl}/` + this.props.birthdayLibraryName, fileName, this.state.selectedFile);
      const gettingfileItem = await this.service.getFileContent(fileResponse.ServerRelativeUrl);
      console.log('gettingfileItem: ', gettingfileItem);
      const createdLibItemId = gettingfileItem.ID
      const updateEmpID = {
        EmployeeId: createdListItemId
      };
      const queryLiburl = this.props.context.pageContext.web.serverRelativeUrl + "/" + this.props.birthdayLibraryName;
      const updatebdayemp = await this.service.updateItem(queryLiburl, updateEmpID, createdLibItemId);
      if (updatebdayemp) {
        const updateLink = {
          ImageLink: {
            Description: fileName,
            Url: fileResponse.ServerRelativeUrl // Assuming the response contains the ServerRelativeUrl property
          }
        }
        const updatelinkemp = await this.service.updateItem(queryListurl, updateLink, createdListItemId);
        if (updatelinkemp) {
          this.setState({ openAddFormModal: false, name: "", designation: "", dateOfBirth: null, selectedFile: null, Reload: true });
        }
      }
    }
  }
  public render(): React.ReactElement<IBirthdayProps> {
    const theme = getTheme();
    const contentStyles = mergeStyleSets({
      container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
      },
      header: [
        theme.fonts.xLargePlus, {
          flex: '1 1 auto',
          color: theme.palette.neutralPrimary,
          display: 'flex',
          alignItems: 'center',
          fontWeight: FontWeights.semibold,
          padding: '12px 12px 14px 284px',
        },
      ],
      header1: [
        theme.fonts.xLargePlus, {
          flex: '1 1 auto',
          color: theme.palette.neutralPrimary,
          display: 'flex',
          alignItems: 'center',
          fontWeight: FontWeights.semibold,
          padding: '10px 20px',
        },
      ],
      body: {
        flex: '4 4 auto',
        padding: '0 20px 20px ',
        overflowY: 'hidden',
        selectors: {
          p: { margin: '14px 0' },
          'p:first-child': { marginTop: 0 },
          'p:last-child': { marginBottom: 0 },
        },
      },
    });
    const CancelIcon: IIconProps = { iconName: 'Cancel' };
    const iconButtonStyles = {
      root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '1px',
      },
      rootHovered: {
        color: theme.palette.neutralDark,
      },
    };
    const AddFormIcon: IIconProps = { iconName: 'Add' };
    return (
      <section className={`${styles.birthday}`}>
        {this.state.isAdmin === true &&
          <div><ActionButton iconProps={AddFormIcon} onClick={this.onAddForm}>Add Form </ActionButton></div>}

        {this.state.employeesBirthday.length > 0 && <StackStyle
          employeesBirthday={this.state.employeesBirthday}
          Reload={this.state.Reload}
          context={this.props.context}
          WebpartTitle={this.props.WebpartTitle} />}
        <div style={{ padding: "18px" }} >
          <Modal
            isOpen={this.state.openAddFormModal}
            isModeless={false}
            containerClassName={contentStyles.container}>
            <div style={{ padding: "18px" }}>
              <div style={{ display: "flex" }}>
                <span style={{ textAlign: "center", display: "flex", justifyContent: "center", flexGrow: "1", width: "450px", fontSize: "20px", fontFamily: 'sans-serif', fontWeight: "400" }}><b>Add Form Details</b></span>
                <IconButton iconProps={CancelIcon} ariaLabel="Close popup modal" onClick={this.onModalClose} styles={iconButtonStyles} />
              </div>
              <TextField label="Name" onChange={this.onNameChange} value={this.state.name} />
              <TextField label="Designation" onChange={this.onDesignationChange} value={this.state.designation} />
              <DatePicker label='Date of Birth'
                value={this.state.dateOfBirth}
                onSelectDate={this.dateOfBirthChange}
                placeholder="Select a date..."
                ariaLabel="Select a date"
                maxDate={new Date()}
                formatDate={this.onFormatDate} />
              <div className={styles.uploadarea}>
                <label htmlFor="inputpic"><strong>Upload Profile image : </strong></label>
                <input type="file"
                  id="inputpic"
                  name="Select Image"
                  required={true}
                  onChange={this.uploadImage}
                />
              </div>
              <PrimaryButton style={{ float: "right", marginTop: "7px", marginBottom: "9px" }} id="b2" onClick={this.onSubmitForm} >Submit</PrimaryButton >
            </div>
          </Modal>
        </div>
      </section>
    );
  }
}
