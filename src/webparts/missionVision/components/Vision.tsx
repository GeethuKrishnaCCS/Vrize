import * as React from 'react';
import styles from "./Vision.module.scss";
import { IVisionConfig } from '../types/Types';

export interface IVisionProps {
    config: IVisionConfig
}

export const Vision: React.FunctionComponent<IVisionProps> = (props: React.PropsWithChildren<IVisionProps>) => {
    const content = props.config;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.imageWrapper}>
                    <img
                        src={content.image.url}
                        alt={content.image.alt}
                        className={styles.image}
                    />
                </div>
                <div className={styles.contentContainer}>
                    <h2 className={styles.title}>{content.title}</h2>
                    <div className={styles.grid}>
                        {content.visionMetrics.map((metric, index) => (
                            <div
                                key={index}
                                className={styles.card}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <img className={styles.icon} src={metric.icon} />
                                <p className={styles.label} dangerouslySetInnerHTML={{ __html: metric.label }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};