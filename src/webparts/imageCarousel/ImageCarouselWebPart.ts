import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Log, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneChoiceGroup,
  PropertyPaneSlider,
  PropertyPaneToggle,
  IPropertyPaneGroup,
  PropertyPaneDropdown,
  PropertyPaneLabel
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ImageCarouselWebPartStrings';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import ImageCarousel from './components/ImageCarousel';
import { Constants, IImageCarouselProps } from './components/IImageCarouselProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
const LOGS: string = "SPFxImageCarousel";
export interface IImageCarouselWebPartProps {
  layout: string;
  colCount: number;
  isAutorotate: boolean;
  duration: number;
  listName: string;
  imagesCount: number;
  currentSite: boolean;
  siteUrl: string;
  height: number;
  width: number;
  WebpartTitle: string;
  ColumnSection: string;
}
export default class ImageCarouselWebPart extends BaseClientSideWebPart<IImageCarouselWebPartProps> {
  public libsOptions: IPropertyPaneDropdownOption[] = [];

  public render(): void {
    if (!this.properties.listName)
      this.getLibraries(this.properties.siteUrl ? this.properties.siteUrl : this.context.pageContext.web.absoluteUrl);

    const element: React.ReactElement<IImageCarouselProps> = React.createElement(
      ImageCarousel,
      {
        layout: this.properties.layout,
        spHttpClient: this.context.spHttpClient,
        context: this.context,
        loggerName: LOGS,
        webUrl: this.properties.siteUrl ? this.properties.siteUrl : this.context.pageContext.web.absoluteUrl,
        listName: this.properties.listName,
        colCount: this.properties.colCount,
        isAutorotate: this.properties.isAutorotate,
        duration: this.properties.duration * 1000,
        imagesCount: this.properties.imagesCount,
        propertyPane: this.context.propertyPane,
        width: this.properties.width,
        height: this.properties.height,
        WebpartTitle: this.properties.WebpartTitle,
        ColumnSection: this.properties.ColumnSection
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  /**
     * Returns the property pane controls for the carousel
     */
  protected get getCarouselConfigurationControls(): IPropertyPaneGroup {

    let grp: IPropertyPaneGroup = {
      groupName: `Configure Auto-rotate`,
      groupFields: [
        PropertyPaneToggle('isAutorotate', { label: `Select Autorotation`, offText: 'Off', onText: 'On' }),
        PropertyPaneSlider('duration', { max: 10, min: 2, label: `Select the duration for autorotation (in sec)`, disabled: !this.properties.isAutorotate }),
        PropertyPaneSlider('imagesCount', { max: Constants.CaroselMax, min: -1, label: `Select the maximum number of images to be displayed` })
      ]
    };
    return grp;
  }
  /**
     * Returns the property pane controls for the List
     */
  protected get getListConfigurationControls(): IPropertyPaneGroup {

    let grp: IPropertyPaneGroup = {
      groupName: `Configure List`,
      groupFields: [
        PropertyPaneSlider('imagesCount', { max: Constants.ListMax, min: -1, label: `Select the maximum number of images to be displayed` }),
        PropertyPaneSlider('colCount', { max: 4, min: 2, label: `Select the maximum number of images to be displayed in a row` })
      ]
    };
    return grp;
  }

  /**
   * Returns the property pane controls for the LightBox
   */
  protected get getLightBoxConfigurationControls(): IPropertyPaneGroup {

    let grp: IPropertyPaneGroup = {
      groupName: `Configure Lighbox`,
      groupFields: [
        PropertyPaneSlider('colCount', { max: 4, min: 1, label: `Select the number of columns`, value: 3 }),
        PropertyPaneSlider('imagesCount', { max: Constants.LightboxMax, min: -1, label: `Select the maximum number of images to be displayed`, value: -1 }),
        PropertyPaneLabel('', { text: '*Select the value as -1 to display all the images' })
      ]
    };
    return grp;
  }
  /**
    * Returns the property pane controls for the source configuration
    */
  protected get getSourceConfiguration(): IPropertyPaneGroup {

    let grp: IPropertyPaneGroup = {
      groupName: `Select Source`,
      groupFields: [
        PropertyPaneToggle('currentSite', { label: `Source of images`, onText: `Current Site`, offText: `Other Site`, offAriaLabel: `Other Site`, onAriaLabel: `Current Site`, checked: true }),
        PropertyPaneTextField('siteUrl', { onGetErrorMessage: (value) => this.getErrorMessage(value), underlined: true, placeholder: `${this.properties.currentSite ? this.context.pageContext.web.absoluteUrl : 'Enter Site Url'}`, disabled: this.properties.currentSite }),
        PropertyPaneDropdown('listName', { options: this.libsOptions, label: `Select Library`, disabled: this.libsOptions.length === 0, selectedKey: this.properties.listName })
      ]
    };

    return grp;
  }
  /**
   * Checks for the valid URL
   * @param value values entered in the site url text box in property pane
   */
  private getErrorMessage(value: string): Promise<string> {

    return this.getLibraries(value).then(msg => {
      return msg;
    });
  }
  /**
     * Retreives the libraries from the url and returns error if any
     * @param siteUrl site url to get libraries from
     */
  private async getLibraries(siteUrl: string): Promise<string> {

    let options: IPropertyPaneDropdownOption[] = [];
    let errorMessage: string = "";

    try {
      // Construct the API URL to get all lists in the site
      const apiUrl = `${siteUrl}/_api/web/lists?$filter=BaseTemplate eq 101`; // 101 is the base template for Document Libraries

      // Make the API request
      const response: SPHttpClientResponse = await this.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
      if (response.ok) {
        const data = await response.json();

        // Extract document libraries from the response

        data.value.forEach((libs: { [x: string]: any; }) => {
          options.push({ key: libs["Title"], text: libs["Title"] });
        });
      }
      else {
        errorMessage = `Invalid site URL`;
        options = [];
      }
    }
    catch (error) {
      Log.error(LOGS, new Error(`Invalid site`));
      Log.error(LOGS, error);
      options = [];
    }

    this.libsOptions = options;
    this.context.propertyPane.refresh();
    return errorMessage;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            this.getSourceConfiguration,
            {
              groupName: `Select Layout`,
              groupFields: [
                PropertyPaneChoiceGroup('layout', {
                  options: [
                    { key: 'carousel', text: 'Carousel', imageSrc: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAATFJREFUWAljYBgFAxwCjMbGxv8H0g1MA2k5yG4WmAPOnj3LCGPTg4aF/ICHwKgDRkNgcIeAmZmZCa2zJNYQ8PT0ZAfm00t///49DXSEPrmOAJqxDpTfTUxMenGZgeEABwcHjtevXx8CatBlZGT0OnXq1EVcmgmJAwu3IKCajv///xcBHdGCTT2GAz5//vwcqMEMZPmZM2e2Y9NEihjQjCqg+g1AM6uBjshG14vhADExMQmgopNADduAGvzRNZDCb2hoYAKasRKoJwCIU4GOmYquH8MB27dv/6mkpGQHDIHzQEdsoCQNbN68+QDQwlCgWVHA6JiDbjmYD0okIIxN0tzc3AKbODXEYPZihACy4SdPnjyBzKcFG68DaGEhupmjDhgNgQEPgdFmOXq2HOWPvBAAANZ5W4HFvWNLAAAAAElFTkSuQmCC`, selectedImageSrc: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAATFJREFUWAljYBgFAxwCjMbGxv8H0g1MA2k5yG4WmAPOnj3LCGPTg4aF/ICHwKgDRkNgcIeAmZmZCa2zJNYQ8PT0ZAfm00t///49DXSEPrmOAJqxDpTfTUxMenGZgeEABwcHjtevXx8CatBlZGT0OnXq1EVcmgmJAwu3IKCajv///xcBHdGCTT2GAz5//vwcqMEMZPmZM2e2Y9NEihjQjCqg+g1AM6uBjshG14vhADExMQmgopNADduAGvzRNZDCb2hoYAKasRKoJwCIU4GOmYquH8MB27dv/6mkpGQHDIHzQEdsoCQNbN68+QDQwlCgWVHA6JiDbjmYD0okIIxN0tzc3AKbODXEYPZihACy4SdPnjyBzKcFG68DaGEhupmjDhgNgQEPgdFmOXq2HOWPvBAAANZ5W4HFvWNLAAAAAElFTkSuQmCC` },
                  ]
                }),
                PropertyPaneTextField('width', {
                  label: 'Width'
                }),
                PropertyPaneTextField('height', {
                  label: 'Height'
                }),
                PropertyPaneTextField('WebpartTitle', {
                  label: 'Webpart Title'
                }),
                PropertyPaneDropdown('ColumnSection', {
                  label: 'Select Column Section',
                  options: [
                    { key: 'FullColumn', text: 'FullColumn' },
                    { key: 'ThreeColumn', text: 'ThreeColumn' }
                  ]
                })
              ]
            },
            this.properties.layout === 'carousel' ?
              this.getCarouselConfigurationControls
              :
              this.properties.layout === 'list' ?
                this.getListConfigurationControls
                :
                this.getLightBoxConfigurationControls

          ]
        }
      ]
    };
  }
}
