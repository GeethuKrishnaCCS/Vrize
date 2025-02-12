import * as React from 'react';
import styles from './ImageCarousel.module.scss';
import { type IImageCarouselProps, type IImageCarouselState, type IImageDetails } from './IImageCarouselProps';
import { PrimaryButton } from '@fluentui/react';
import { Log } from '@microsoft/sp-core-library';
import { Carousel } from '../../../shared/components/Carousel/Carousel';
import { BaseService } from '../../../shared/services/BaseService';

const CAROUSEL: string = 'carousel';
const LIGHTBOX: string = 'lightbox';

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
      const queryURL = this.props.context.pageContext.web.serverRelativeUrl + "/" + this.props.listName;
      const selectquery = "*,FileRef,FileLeafRef"
      const imagedoc = await this.service.getImageItems(queryURL, selectquery);
      imagedoc.forEach((image: { [x: string]: any; }) => {
        imageDetails.info.push({ caption: image["Caption"], description: image["Description"], name: image["FileLeafRef"], path: image["FileRef"], redirectLink: image["RedirectURL"] !== null ? image["RedirectURL"]["Url"] : "#" });
      });
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
          <h1 className={styles.pagetitle}>{this.props.WebpartTitle}</h1>
          {/* <div className={`ms-Grid`}> */}
          {/* <div className={`ms-Grid-row`}> */}
          {/* <div className={`ms-Grid-col ms-sm12`}> */}
          {
            this.props.webUrl && this.props.listName ?

              this.props.layout === CAROUSEL ?
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Carousel duration={this.props.duration}
                    images={this.state.imageInfo}
                    imagesCount={Number(this.state.imageCount)}
                    isAutoRotate={this.props.isAutorotate}
                    height={this.props.height}
                    width={this.props.width}
                    columnSection={this.props.ColumnSection}
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
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    );
  }
}
