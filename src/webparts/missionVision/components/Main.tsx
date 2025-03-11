import * as React from 'react';
import styles from './Main.module.scss';
import { CoreValues } from './CoreValues';
import { Vision } from './Vision';
import { Mission } from './Mission';
import { Story } from './Story';
import { ICoreValuesConfig, IMissionConfig, IStoryConfig, IVisionConfig } from '../types/Types';

export interface IMissionVisionProps {
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  storyConfig: IStoryConfig;
  missionConfig: IMissionConfig;
  visionConfig: IVisionConfig;
  coreValuesConfig: ICoreValuesConfig;
}

export default class Main extends React.Component<IMissionVisionProps, {}> {
  public render(): React.ReactElement<IMissionVisionProps> {
    const {
      hasTeamsContext, storyConfig, missionConfig, visionConfig, coreValuesConfig
    } = this.props;

    return (
      <section className={`${styles.missionVision} ${hasTeamsContext ? styles.teams : ''}`}>
        <Story config={storyConfig} />
        <Mission config={missionConfig} />
        <Vision config={visionConfig} />
        <CoreValues config={coreValuesConfig} />
      </section>
    );
  }
}
