import * as React from 'react';
import styles from './FormsAndTemplates.module.scss';
import type { IFormsAndTemplatesProps, IFormsAndTemplatesState } from './IFormsAndTemplatesProps';
import { BaseService } from '../../../shared/services/BaseService';
import { ActionButton, FontWeights, IIconProps, IconButton, Link, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets } from '@fluentui/react';
import * as moment from 'moment';
import ModalOverlay from '../../../shared/controls/Overlay/Overlay';
import { HttpClient, IHttpClientOptions } from '@microsoft/sp-http';
// import * as _ from 'lodash';
export default class FormsAndTemplates extends React.Component<IFormsAndTemplatesProps, IFormsAndTemplatesState, {}> {
  private service: BaseService;/* To call the service file */
  constructor(props: IFormsAndTemplatesProps) {
    super(props);
    this.state = {
      formDetails: [],
      openAddFormModal: false,
      formName: "",
      formDescription: "",
      formLink: "",
      currentUser: {
        id: "",
        email: "",
        title: ""
      },
      modaloverlay: { isOpen: false, modalText: "" },
      ownerEmail: "",
      status: "Pending",
      isAdmin: false
    }
    const siteURL = window.location.protocol + "//" + window.location.hostname + this.props.context.pageContext.web.serverRelativeUrl;
    this.service = new BaseService(this.props.context, siteURL);
    this.getFormsAndTemplates = this.getFormsAndTemplates.bind(this);
    this.onAddForm = this.onAddForm.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onFormNameChange = this.onFormNameChange.bind(this);
    this.onFormDescriptionChange = this.onFormDescriptionChange.bind(this);
    this.onFormLinkChange = this.onFormLinkChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onOwnerEmailChange = this.onOwnerEmailChange.bind(this);
    this.checkFormStatus = this.checkFormStatus.bind(this);

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
      /* fetch forms */

      const groupName = this.props.groupName; // Replace with your group name
      const isMember = await this.isUserMemberOfGroup(groupName);
      console.log(`Is user a member of the group "${groupName}":`, isMember);
      if (isMember === true) {
        this.setState({ isAdmin: true });
        await this.getFormsAndTemplates();
      }
      else {
        this.setState({ isAdmin: false });
        await this.getFormsAndTemplates();
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
  public async getFormsAndTemplates() {
    const formDetails: any[] = [];
    const queryurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.listName;
    const existingItems = await this.service.getListItems(queryurl);
    console.log(existingItems);
    if (existingItems.length !== 0) {
      for (let i = 0; i < existingItems.length; i++) {
        const item = existingItems[i];
        let editEnable = false;
        this.setState({ status: "Pending" });
        const formLink = item.FormLink;
        const urlParams = new URLSearchParams(formLink.split('?')[1]);
        const formId = urlParams.get('id');
        console.log(formId);
        if (formId !== null) {
          if (item.FormOwner === this.state.currentUser.email) {
            editEnable = true;
          }
          const statuscheck = await this.checkFormStatus(item, formId);
          const checked = [await statuscheck];
          if (checked) {
            formDetails.push({
              ID: item.ID,
              Title: item.Title,
              Description: item.Description,
              Link: item.FormLink,
              Created: moment(item.Created).format("DD MMMM YYYY"),
              Status: this.state.status,
              EditEnable: editEnable
            });
          }
        }
        this.setState({ formDetails: formDetails, modaloverlay: { isOpen: false, modalText: "" } });
      }
      // let sorted_formDetails = _.orderBy(formDetails, (o: any) => {
      //   return o.ID;
      // }, ['desc']);
      // console.log(sorted_formDetails);
      this.setState({ formDetails: formDetails, modaloverlay: { isOpen: false, modalText: "" } });
    }
    else {
      this.setState({ modaloverlay: { isOpen: false, modalText: "No Forms Found" } });
    }
  }
  public async checkFormStatus(item: any, formId: any) {
    const postURL = this.props.laURL;
    const requestHeaders: Headers = new Headers();
    requestHeaders.append("Content-type", "application/json");
    const body: string = JSON.stringify({
      'currentUserEmail': this.state.currentUser.email,
      'creatorUserId': item.OwnerGUID,
      'formId': formId
    });
    const postOptions: IHttpClientOptions = {
      headers: requestHeaders,
      body: body
    };
    if (item.OwnerGUID !== null) {
      const response = await this.props.context.httpClient.post(postURL, HttpClient.configurations.v1, postOptions);
      const responseJSON = await response.json();
      if (response.ok) {
        console.log(responseJSON);
        if (responseJSON.isSubmitted === true) {
          this.setState({ status: "Submitted" })
        }
        else if (responseJSON.isSubmitted === "noPermission") {
          this.setState({ status: "noPermission" })
        }
        else {
          this.setState({ status: "Pending" })
        }
      }
    }
    else {
      this.setState({ status: "Pending" })
    }

  }
  public onModalClose = () => {
    this.setState({ openAddFormModal: false, formName: "", formDescription: "", formLink: "", ownerEmail: "" });

  }
  public onAddForm = () => {
    this.setState({ openAddFormModal: true });
  }
  public onFormNameChange = (event: any, name: string) => {
    if (name.trim() !== "") {
      this.setState({ formName: name });
    }
  }
  public onFormDescriptionChange = (event: any, description: string) => {
    if (description.trim() !== "") {
      this.setState({ formDescription: description });
    }
  }
  public onOwnerEmailChange = (event: any, email: string) => {
    if (email.trim() !== "") {
      this.setState({ ownerEmail: email });
    }
  }

  public onFormLinkChange = (event: any, link: string) => {
    if (link.trim() !== "") {
      this.setState({ formLink: link });
    }
  }
  public onSubmitForm = async () => {
    const formDetails = {
      Title: this.state.formName,
      Description: this.state.formDescription,
      FormLink: this.state.formLink,
      FormOwner: this.state.ownerEmail
    };
    const queryurl = this.props.context.pageContext.web.serverRelativeUrl + "/Lists/" + this.props.listName;
    await this.service.addListItem(queryurl, formDetails);
    this.setState({ openAddFormModal: false, formName: "", formDescription: "", formLink: "", ownerEmail: "" });
    await this.getFormsAndTemplates()
  }
  public onEditClick = (formlink: string) => {
    const editlink = formlink.replace("ResponsePage", "DesignPageV2");
    window.open(editlink, '_blank', 'noopener,noreferrer');
  }
  public render(): React.ReactElement<IFormsAndTemplatesProps> {
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
      <section className={`${styles.formsAndTemplates}`}>
        <h1 className={styles.pagetitle}>{this.props.WebpartTitle}</h1>
        {this.state.isAdmin === true &&
          <div><ActionButton iconProps={AddFormIcon} onClick={this.onAddForm}>Add Form </ActionButton></div>}
        {<div className={styles.divrow}>
          {/*  Iterate over each item to generate the carousel */}
          {this.state.formDetails.map((form: any, index: any) => {
            return (
              <div className={styles.card}>
                <Link href={form.Link} target='_blank' rel='noopener noreferrer'>
                  <h1 className={styles.h1}>{form.Title}</h1></Link>
                <div className={styles.description}>{form.Description}</div>
                <div className={styles.cardfooter}>
                  {form.Status === "Submitted" &&
                    <div className={styles.submitStatus}>{form.Status}</div>}
                  {form.Status === "noPermission" &&
                    <div className={styles.noPermissionStatus}>{this.props.noPermissionErrorMsg}</div>}
                  {form.Status === "Pending" &&
                    <div className={styles.pendingStatus}>{form.Status}</div>}
                  <div className={styles.date}>{form.Created}</div>
                  {form.EditEnable === true &&
                    <div className={styles.button}>
                      <PrimaryButton
                        className={styles.btnprimary}
                        text="Edit Form"
                        onClick={() => this.onEditClick(form.Link)}
                      /></div>}
                </div>
              </div>
            );
          })}

        </div>}
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
              <TextField id="FormName" label="Form Name" onChange={this.onFormNameChange} value={this.state.formName} />
              <TextField id="FormDescription" label="Form Description" onChange={this.onFormDescriptionChange} value={this.state.formDescription} />
              <TextField id="FormLink" label="Form Link" onChange={this.onFormLinkChange} value={this.state.formLink} />
              <TextField id="OwnerEmail" label="Owner Email" onChange={this.onOwnerEmailChange} value={this.state.ownerEmail} />

              {this.state.formName !== "" && this.state.formLink !== "" &&
                this.state.ownerEmail !== "" && this.state.formDescription !== "" &&
                <PrimaryButton style={{ float: "right", marginTop: "7px", marginBottom: "9px" }} id="b2" onClick={this.onSubmitForm} >Submit</PrimaryButton >}
            </div>
          </Modal>
        </div>
        <ModalOverlay isModalOpen={this.state.modaloverlay.isOpen} modalText={this.state.modaloverlay.modalText} />

      </section>
    );
  }
}
