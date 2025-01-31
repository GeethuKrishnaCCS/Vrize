import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup,
  PropertyPaneSlider,
  PropertyPaneToggle,
  IPropertyPaneGroup
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'RewardsCarouselWebPartStrings';
import RewardsCarousel from './components/RewardsCarousel';
import { Constants, IRewardsCarouselProps } from './components/IRewardsCarouselProps';

export interface IRewardsCarouselWebPartProps {
  description: string;
}

export default class RewardsCarouselWebPart extends BaseClientSideWebPart<IRewardsCarouselProps> {

  // private _isDarkTheme: boolean = false;
  // private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IRewardsCarouselProps> = React.createElement(
      RewardsCarousel,
      {
        description: this.properties.description,
        context: this.context,
        siteUrl: this.context.pageContext.web.serverRelativeUrl,
        isAutorotate: this.properties.isAutorotate,
        duration: this.properties.duration * 1000,
        width: this.properties.width,
        height: this.properties.height,
        WebpartTitle: this.properties.WebpartTitle,
        rewardsListName: this.properties.rewardsListName,
        rewardsLibraryName: this.properties.rewardsLibraryName,
        defaultLibraryName: this.properties.defaultLibraryName,
        groupName: this.properties.groupName,
        ColumnSection: this.properties.ColumnSection
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      // this._environmentMessage = message;
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

    // this._isDarkTheme = !!currentTheme.isInverted;
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
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('WebpartTitle', {
                  label: "Webpart Title"
                }),
                PropertyPaneTextField('groupName', {
                  label: "groupName"
                }),
                PropertyPaneTextField('rewardsListName', {
                  label: "Rewards List Name"
                }),
                PropertyPaneTextField('rewardsLibraryName', {
                  label: "Rewards Library Name"
                }),
                PropertyPaneTextField('defaultLibraryName', {
                  label: "Default Library Name"
                }),
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
                })
              ]
            },
            this.getCarouselConfigurationControls

          ]
        }
      ]
    }


  }
}
