import * as React from 'react';
import styles from "./Mission.module.scss";
import { IMissionConfig } from '../types/Types';

export interface IMissionProps {
    config: IMissionConfig;
}

export const Mission: React.FunctionComponent<IMissionProps> = (props: React.PropsWithChildren<IMissionProps>) => {
    const content = props.config
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <h2 className={styles.title}>{content.title}</h2>
                        <div className={styles.textWrapper}>
                            <div className={styles.subtitle}>{content.subtitle}</div>
                            <p className={styles.text}>{content.text}</p>
                        </div>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img
                            src={content.image.url}
                            alt={content.image.alt}
                            className={styles.image}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};
