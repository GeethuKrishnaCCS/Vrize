import * as React from 'react';
import styles from './Rewards.module.scss';
import type { IRewardsProps, IRewardsState } from './IRewardsProps';
import { DatePicker, Dropdown, FontWeights, IDropdownOption, IIconProps, IconButton, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets } from '@fluentui/react';
import StackStyle from './StackStyle';
import { BaseService } from '../../../shared/services/BaseService';
import * as moment from 'moment';
import * as _ from 'lodash';

export default class Rewards extends React.Component<IRewardsProps, IRewardsState, {}> {
  private service: BaseService;/* To call the service file */
  constructor(props: IRewardsProps) {
    super(props);
    this.state = {
      currentUser: {
        id: "",
        email: "",
        title: ""
      },
      modaloverlay: { isOpen: false, modalText: "" },
      employeesReward: [],
      Reload: false,
      openAddFormModal: false,
      name: "",
      designation: "",
      dateOfBirth: null,
      selectedFile: null,
      isAdmin: false,
      issueDate: null,
      categoryOptions: [],
      category: { key: null, text: "" }
    }
    const siteURL = window.location.protocol + "//" + window.location.hostname + this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);
    this.getEmployeeDatas = this.getEmployeeDatas.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onAddForm = this.onAddForm.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onDesignationChange = this.onDesignationChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
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
    const queryurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.rewardsListName;
    const selectquery = "*,Category/Title,Category/ID";
    const expandquery = "Category";
    const employeeData = await this.service.getItemsSelectExpand(queryurl, selectquery, expandquery);
    if (employeeData) {
      const EmployeeDetails: any[] = [];
      for (let i = 0; i < employeeData.length; i++) {
        const item = employeeData[i];
        if (item.ImageLink === null) {
          const queryURL = this.props.context.pageContext.web.serverRelativeUrl + "/" + this.props.defaultLibraryName;
          const selectquery = "*,FileRef,FileLeafRef"
          const imagedoc = await this.service.getImageItems(queryURL, selectquery);
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


        EmployeeDetails.push({
          ImageURL: imageurl,
          Designation: item.Designation,
          FullName: item.EmployeeName,
          Year: moment(item.IssueDate).format("YYYY"),
          Category: item.Category.Title
        });

      }
      this.setState({
        employeesReward: EmployeeDetails
      })

    }
    await this.getCategory();
  }
  public getCategory = async () => {
    const queryurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.categoryListName;
    const categoryData = await this.service.getListItems(queryurl);
    if (categoryData) {
      const CategoryOptions: any[] = [];
      let sorted_category: any[] = [];
      for (let i = 0; i < categoryData.length; i++) {
        const item = categoryData[i];
        CategoryOptions.push({ key: item.ID, text: item.Title });
      }
      sorted_category = _.orderBy(CategoryOptions, 'key', ['asc']);
      this.setState({ categoryOptions: sorted_category });
    }
  }
  //Dropdown Methos
  public categoryChange(event: React.FormEvent<HTMLDivElement>, category: IDropdownOption) {
    this.setState({ category: category });
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
    if (designation.trim() === "") {
      this.setState({ designation: "" });
    }
    else {
      this.setState({ designation: designation });
    }
  }
  public IssueDateChange = (date?: Date): void => {
    this.setState({ issueDate: date });
  }
  // On format date
  private onFormatDate = (date: Date): string => {
    const selectd = moment(date).format("DD-MM-YYYY",);
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
    this.setState({ modaloverlay: { isOpen: true, modalText: "Data Saving..." } });
    const formDetails = {
      EmployeeName: this.state.name,
      Designation: this.state.designation,
      Year: moment(this.state.issueDate).format("YYYY"),
      IssueDate: this.state.issueDate,
      CategoryId: this.state.category.key
    };
    const queryListurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.rewardsListName;
    const addbdayemp = await this.service.addListItem(queryListurl, formDetails);
    const createdListItemId = addbdayemp.ID; // Assuming the response contains the created item ID
    if (this.state.selectedFile !== null) {
      const empName = this.state.name.replace(/[^a-zA-Z0-9 ]/g, '');
      const fileName = empName + this.state.selectedFile.name.substring(this.state.selectedFile.name.lastIndexOf('.'));
      const fileResponse = await this.service.uploadDocument(`${this.props.context.pageContext.web.serverRelativeUrl}/` + this.props.rewardsLibraryName, fileName, this.state.selectedFile);
      const gettingfileItem = await this.service.getFileContent(fileResponse.ServerRelativeUrl);
      const createdLibItemId = gettingfileItem.ID
      const updateEmpID = {
        RewardsId: createdListItemId
      };
      const queryLiburl = this.props.context.pageContext.web.serverRelativeUrl + "/" + this.props.rewardsLibraryName;
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
          await this.getEmployeeDatas();
          this.setState({ modaloverlay: { isOpen: false, modalText: "" }, openAddFormModal: false, name: "", designation: "", selectedFile: null, Reload: true });
        }
      }
    }
  }

  public render(): React.ReactElement<IRewardsProps> {
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
      <section className={`${styles.rewards}`}>
        <div className={styles.heading}>
          <h1 className={styles.pagetitle}>{this.props.WebpartTitle}</h1>

          {this.state.isAdmin === true && (
            <div className={styles.buttonAdd}>
              <PrimaryButton
                iconProps={AddFormIcon}
                onClick={this.onAddForm}
                className={styles.addform}
              >
                Add Form{" "}
              </PrimaryButton>
            </div>
          )}
        </div>


        {this.state.employeesReward.length > 0 && <StackStyle
          employeesReward={this.state.employeesReward}
          Reload={this.state.Reload}
          context={this.props.context}
          WebpartTitle={this.props.WebpartTitle} />}
        <div style={{ padding: "18px" }} >
          <Modal
            isOpen={this.state.openAddFormModal}
            isModeless={false}
            containerClassName={contentStyles.container}>
            <div className={styles.modalbody}>
              <div className={styles.modalheader}>
                <span
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    flexGrow: "1",
                    fontSize: "20px",
                    fontFamily: "sans-serif",
                    fontWeight: "400",
                    color: "#fff",
                  }}
                >
                  <b>Add Form Details</b>
                </span>
                <IconButton
                  iconProps={CancelIcon}
                  ariaLabel="Close popup modal"
                  onClick={this.onModalClose}
                  styles={iconButtonStyles}
                />
              </div>
              <div className={styles.modalcontent}>
                <TextField label="Name" onChange={this.onNameChange} value={this.state.name} />
                <TextField label="Designation" onChange={this.onDesignationChange} value={this.state.designation} />
                <DatePicker label="Issue Date *"
                  value={this.state.issueDate}
                  placeholder="Select a date..."
                  minDate={new Date()}
                  onSelectDate={this.IssueDateChange}
                  formatDate={this.onFormatDate} />
                <Dropdown
                  label='Category'
                  options={this.state.categoryOptions}
                  onChange={this.categoryChange}
                  selectedKey={this.state.category.key}
                />
                <div className={styles.uploadarea}>
                  <label htmlFor="inputpic"><strong>Upload Profile image : </strong></label>
                  <input type="file"
                    id="inputpic"
                    name="Select Image"
                    required={true}
                    onChange={this.uploadImage}
                  />
                </div>
              </div>
              <div className={styles.modalfooter}>
                {this.state.name !== "" && this.state.designation !== "" &&
                  this.state.issueDate !== null && this.state.category.key !== null && <PrimaryButton id="b2" onClick={this.onSubmitForm}>
                    Submit
                  </PrimaryButton>}
              </div>
            </div>
          </Modal>
        </div>

      </section>
    );
  }
}
