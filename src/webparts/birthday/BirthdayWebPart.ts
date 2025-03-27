import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'BirthdayWebPartStrings';
import Birthday from './components/Birthday';
import { IBirthdayProps } from './components/IBirthdayProps';
import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";

export interface IPropertyControlsTestWebPartProps {
  selecteddate: IDateTimeFieldValue;
}

export default class BirthdayWebPart extends BaseClientSideWebPart<IBirthdayProps> {

  public render(): void {
    const element: React.ReactElement<IBirthdayProps> = React.createElement(
      Birthday,
      {
        description: this.properties.description,
        context: this.context,
        siteUrl: this.context.pageContext.web.serverRelativeUrl,
        WebpartTitle: this.properties.WebpartTitle,
        birthdayListName: this.properties.birthdayListName,
        birthdayLibraryName: this.properties.birthdayLibraryName,
        DateEnter: this.properties.DateEnter,
        DefaultGalleryName: this.properties.DefaultGalleryName,
        heading: this.properties.heading,
        headingColor: this.properties.headingColor,
        body: this.properties.body,
        bodyColor: this.properties.bodyColor,
        GreetingsListName: this.properties.GreetingsListName,
        buttonName: this.properties.buttonName,
        buttonColor: this.properties.buttonColor
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
                PropertyPaneTextField('birthdayListName', {
                  label: "Birthday List Name"
                }),
                PropertyPaneTextField('birthdayLibraryName', {
                  label: "Birthday Library Name"
                }),
                PropertyPaneTextField('DateEnter', {
                  label: "Enter Date in DD-MM"
                }),
                PropertyPaneTextField('DefaultGalleryName', {
                  label: 'Default Gallery'
                }),
                PropertyPaneTextField('GreetingsListName', {
                  label: 'Greetings List Name'
                }),
                PropertyPaneTextField('heading', {
                  label: 'Mail Heading'
                }),
                PropertyPaneTextField('headingColor', {
                  label: 'Mail Heading Color'
                }),
                PropertyPaneTextField('body', {
                  label: 'Mail body'
                }),
                PropertyPaneTextField('bodyColor', {
                  label: 'Mail body Color'
                }),
                PropertyPaneTextField('buttonName', {
                  label: 'Button Name'
                }),
                PropertyPaneTextField('buttonColor', {
                  label: 'Button Color'
                })

              ]
            }
          ]
        }
      ]
    };
  }
}
