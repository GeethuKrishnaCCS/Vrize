import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneLabel,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'MissionVisionWebPartStrings';
import MissionVision, { IMissionVisionProps } from './components/Main';
import { PropertyFieldMonacoEditor } from '@pnp/spfx-property-controls';
import { ICoreValuesConfig, IMissionConfig, IStoryConfig, IVisionConfig } from './types/Types';
// import { generateJsonSchema } from './utils/generateSchema';

export interface IMissionVisionWebPartProps {
  storyConfig: string;
  missionConfig: string;
  visionConfig: string;
  coreValuesConfig: string;
}

export default class MissionVisionWebPart extends BaseClientSideWebPart<IMissionVisionWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IMissionVisionProps> = React.createElement(
      MissionVision,
      {
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        storyConfig: this.parseConfig<IStoryConfig>(this.properties.storyConfig),
        missionConfig: this.parseConfig<IMissionConfig>(this.properties.missionConfig),
        visionConfig: this.parseConfig<IVisionConfig>(this.properties.visionConfig),
        coreValuesConfig: this.parseConfig<ICoreValuesConfig>(this.properties.coreValuesConfig),
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private parseConfig<T>(config: string | T | undefined): T {
    try {
      if (typeof config === "string") {
        return JSON.parse(config) as T;
      }
      return (config || undefined) as T; // Return the object or undefined
    } catch (error) {
      console.warn("Failed to parse config. Returning default value.", error);
      return undefined as unknown as T; // Fallback to undefined
    }
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

    this._isDarkTheme = !!currentTheme.isInverted;
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
                PropertyPaneLabel('storyConfigJSONField', {
                  text: "Story Config (JSON)"
                }),
                PropertyFieldMonacoEditor('storyConfig', {
                  key: 'storyConfigJSONField',
                  // value: this.properties.StatusMappingJSON,
                  value: typeof this.properties.storyConfig === "string" ? this.properties.storyConfig : JSON.stringify(this.properties.storyConfig, null, 2),
                  language: "json",
                  showLineNumbers: true,
                  jsonDiagnosticsOptions: {
                    allowComments: true,
                    validate: true,
                    schemaValidation: 'error',
                    // schemas: [
                    //   {
                    //     uri: 'storyConfigSchema',
                    //     fileMatch: ['*'],
                    //   }
                    // ]
                  }
                }),
                PropertyPaneLabel('missionConfigJSONField', {
                  text: "Mission Config (JSON)"
                }),
                PropertyFieldMonacoEditor('missionConfig', {
                  key: 'missionConfigJSONField',
                  value: typeof this.properties.missionConfig === "string" ? this.properties.missionConfig : JSON.stringify(this.properties.missionConfig, null, 2),
                  language: "json",
                  showLineNumbers: true,
                  jsonDiagnosticsOptions: {
                    allowComments: true,
                    validate: true,
                    schemaValidation: 'error'
                  }
                }),
                PropertyPaneLabel('visionConfigJSONField', {
                  text: "Mission Config (JSON)"
                }),
                PropertyFieldMonacoEditor('visionConfig', {
                  key: 'missionConfigJSONField',
                  value: typeof this.properties.visionConfig === "string" ? this.properties.visionConfig : JSON.stringify(this.properties.visionConfig, null, 2),
                  language: "json",
                  showLineNumbers: true,
                  jsonDiagnosticsOptions: {
                    allowComments: true,
                    validate: true,
                    schemaValidation: 'error'
                  }
                }),
                PropertyPaneLabel('coreValuesConfigJSONField', {
                  text: "Core Values Config (JSON)"
                }),
                PropertyFieldMonacoEditor('coreValuesConfig', {
                  key: 'coreValuesConfigJSONField',
                  value: typeof this.properties.coreValuesConfig === "string" ? this.properties.coreValuesConfig : JSON.stringify(this.properties.coreValuesConfig, null, 2),
                  language: "json",
                  showLineNumbers: true,
                  jsonDiagnosticsOptions: {
                    allowComments: true,
                    validate: true,
                    schemaValidation: 'error'
                  }
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
