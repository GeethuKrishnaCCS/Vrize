import * as React from 'react';
import styles from './ImageCarousel.module.scss';
import { type IImageCarouselProps, type IImageCarouselState, type IImageDetails } from './IImageCarouselProps';
// import { escape } from '@microsoft/sp-lodash-subset';
// import { Lightbox } from '../../../components/Lightbox/Lightbox';
// import { List } from '../../../components/List/List';
import { PrimaryButton } from '@fluentui/react';
// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Log } from '@microsoft/sp-core-library';
import { Carousel } from '../../../shared/components/Carousel/Carousel';
import { BaseService } from '../../../shared/services/BaseService';

const CAROUSEL: string = 'carousel';
const LIGHTBOX: string = 'lightbox';
// const LIST: string = 'list';

export default class ImageCarousel extends React.Component<IImageCarouselProps, IImageCarouselState, {}> {
  private service: BaseService;/* To call the service file */
  constructor(props: IImageCarouselProps, state: IImageCarouselState) {
    super(props);

    this.state = {
      imageCount: 10,
      imageInfo: { info: [] }
    };
    this.service = new BaseService(this.props.context, this.props.webUrl);
    this.getItems = this.getItems.bind(this);
  }
  /**
   * Show the configure message, if ther webpart is not configured
   */
  private showConfigureMessge(): JSX.Element {
    return (
      <div className={styles.center}>
        <h2>Webpart is not configured</h2>
        <PrimaryButton iconProps={{ iconName: "Settings" }} onClick={() => this.props.propertyPane.open()}>Configure</PrimaryButton>
      </div>
    );
  }
  public async componentDidMount(): Promise<void> {
    await this.getItems();
  }
  /**
   * Gets the Images from the SharePoint Library to be displayed in the control
   */
  private async getItems(): Promise<void> {
    // initialize the image variable
    let imageDetails: IImageDetails = { info: [] };

    try {
      // Get the max number of records to be fetched
      // let maxRec: number = this.props.layout == CAROUSEL ? Constants.CaroselMax : this.props.layout == LIST ? Constants.ListMax : Constants.LightboxMax;
      // const apiUrl = `${this.props.webUrl}/_api/web/lists/getByTitle('${this.props.listName}')/items`;
      // const filterQuery = `?$filter=Enable eq 1&$expand=File&$top=${this.props.imagesCount > 0 ? this.props.imagesCount : maxRec}&$select=RedirectLink,Caption,Description,File/Name,File/ServerRelativeUrl`;
      // // Make the request to SharePoint
      // const response: SPHttpClientResponse = await this.context.spHttpClient.get(apiUrl + filterQuery, SPHttpClient.configurations.v1);
      const queryURL = this.props.context.pageContext.web.serverRelativeUrl + "/" + this.props.listName;
      const selectquery = "*,FileRef,FileLeafRef"
      const imagedoc = await this.service.getImageItems(queryURL, selectquery);
      console.log(imagedoc);
      // if (response.ok) {
      //   const data = await response.json();
      imagedoc.forEach((image: { [x: string]: any; }) => {
        imageDetails.info.push({ caption: image["Caption"], description: image["Description"], name: image["FileLeafRef"], path: image["FileRef"], redirectLink: image["RedirectURL"] !== null ? image["RedirectURL"]["Url"] : "#" });
      });
      // }
      // else {
      //   console.log(response)
      // }
    }
    catch (e) {
      Log.error(this.props.loggerName, new Error(`Error occured in ImageGallery.getItems()`));
      Log.error(this.props.loggerName, e);
    }
    finally {
      this.setState({ imageInfo: imageDetails, imageCount: imageDetails.info.length });
    }
  }
  public render(): React.ReactElement<IImageCarouselProps> {

    return (
      <div className={styles.imageCarousel}>
        <div className={styles.container}>
          <div className={`ms-Grid`}>
            <div className={`ms-Grid-row`}>
              <div className={`ms-Grid-col ms-sm12`}>
                {
                  this.props.webUrl && this.props.listName ?

                    this.props.layout == CAROUSEL ?
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Carousel duration={this.props.duration}
                          images={this.state.imageInfo}
                          imagesCount={Number(this.state.imageCount)}
                          isAutoRotate={this.props.isAutorotate}
                          height={this.props.height}
                          width={this.props.width}
                          showCaptions={true}></Carousel>
                      </React.Suspense>
                      :
                      this.props.layout === LIGHTBOX ?
                        <React.Suspense fallback={<div>Loading...</div>}>
                          {/* <Lightbox imagesCount={this.state.imageCount} colCount={this.props.colCount} images={this.state.imageInfo}></Lightbox> */}
                        </React.Suspense>
                        :
                        <React.Suspense fallback={<div>Loading...</div>}>
                          {/* <List imagesCount={this.state.imageCount} images={this.state.imageInfo}></List> */}
                        </React.Suspense>
                    :
                    this.showConfigureMessge()
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
