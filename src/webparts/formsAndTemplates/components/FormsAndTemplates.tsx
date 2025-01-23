import * as React from 'react';
import styles from './FormsAndTemplates.module.scss';
import type { IFormsAndTemplatesProps } from './IFormsAndTemplatesProps';

export default class FormsAndTemplates extends React.Component<IFormsAndTemplatesProps, {}> {
  public render(): React.ReactElement<IFormsAndTemplatesProps> {

    return (
      <section className={`${styles.formsAndTemplates}`}>

      </section>
    );
  }
}
