import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'MarqueeWebPartStrings';

export interface IMarqueeWebPartProps {
  Statement: string;
}

export default class MarqueeWebPart extends BaseClientSideWebPart<IMarqueeWebPartProps> {


  public render(): void {
    this.domElement.innerHTML = `
    <div class="marquee-container">
       <div class="marquee">${this.properties.Statement}</div>
     </div>
     <style>
       .marquee-container {
         width: 100%;
         overflow: hidden;
         white-space: nowrap;
         box-sizing: border-box;
         background-color: rgb(208 208 208);
         border-radius: 4px;
         height: 100%;
        
       }
       .marquee {
         display: inline-block;
         padding-left: 100%;
         animation: marquee 12s linear infinite;
         padding: 10px 0 10px 100%;
         color: #222;
         font-size: 16px;
         
       }
       @keyframes marquee {
         0% { transform: translateX(0); }
         100% { transform: translateX(-100%); }
       }
     </style>
   `;
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
                PropertyPaneTextField('Statement', {
                  label: 'Statement'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
