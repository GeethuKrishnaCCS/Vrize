import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'MultiMarqueeWebPartStrings';

export interface IMultiMarqueeWebPartProps {
  englishText: string;
  hindiText: string;
  spanishText: string;
  cyrillicText: string;
}

export default class MultiMarqueeWebPart extends BaseClientSideWebPart<IMultiMarqueeWebPartProps> {

  public render(): void {
    const englishText = this.properties.englishText;
    const hindiText = this.properties.hindiText; // Replace with the actual Hindi text
    const spanishText = this.properties.spanishText; // Replace with the actual Spanish text
    const cyrillicText = this.properties.cyrillicText; // Replace with the actual Cyrillic text

    this.domElement.innerHTML = `
     <div class="marquee-container">
        <div class="marquee" id="marqueeText">${englishText}</div>
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
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }
      </style>
    `;
    let currentIndex = 1;
    setInterval(() => {
      const marqueeText = document.getElementById('marqueeText');
      const texts = [englishText, hindiText, spanishText, cyrillicText];


      if (marqueeText) {
        marqueeText.innerText = texts[currentIndex];
        currentIndex = (currentIndex + 1) % texts.length;
      }
    }, 10000); // Switch text every 10 seconds
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
                PropertyPaneTextField('englishText', {
                  label: 'English Text'
                }),
                PropertyPaneTextField('hindiText', {
                  label: 'Hindi Text'
                }),
                PropertyPaneTextField('spanishText', {
                  label: 'Spanish Text'
                }),
                PropertyPaneTextField('cyrillicText', {
                  label: 'Cyrillic Text'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
