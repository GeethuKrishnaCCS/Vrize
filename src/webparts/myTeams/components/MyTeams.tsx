import * as React from 'react';
import styles from './MyTeams.module.scss';
import type { IMyTeamsProps } from './IMyTeamsProps';

export default class MyTeams extends React.Component<IMyTeamsProps, {}> {
  public render(): React.ReactElement<IMyTeamsProps> {


    return (
      <section className={`${styles.myTeams}`}>

      </section>
    );
  }
}
