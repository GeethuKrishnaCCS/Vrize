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
                        <h3 className={styles.subtitle}>{content.subtitle}</h3>
                        <p className={styles.text}>{content.text}</p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img
                            src={content.image.url}
                            alt={content.image.alt}
                            className={styles.image}
                        />
                    </div>
                    {/* <div className={styles.circle}>
                        <div className={styles.line}></div>
                    </div> */}
                </div>
            </div>
        </section>
    );
};
