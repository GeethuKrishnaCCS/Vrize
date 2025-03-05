import * as React from 'react';
import styles from './CoreValues.module.scss';
import { ICoreValuesConfig } from '../types/Types';

export interface ICoreValuesProps {
    config: ICoreValuesConfig;
}

export const CoreValues: React.FunctionComponent<ICoreValuesProps> = (props: React.PropsWithChildren<ICoreValuesProps>) => {
    const content = props.config;

    const CoreValueItem: React.FC<{ value: any; delay: number }> = ({ value, delay }) => (
        <div className={styles.valueItem} style={{ animationDelay: `${delay}s` }}>
            <span className={styles.letter}>{value.letter}</span>
            <div className={styles.valueContent}>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
            </div>
        </div>
    );

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>{content.title}</h2>
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <div
                            className={styles.text}
                            dangerouslySetInnerHTML={{ __html: content.text }}
                        />
                        <div className={styles.valuesList}>
                            {content.values.map((value, index) => (
                                <CoreValueItem key={index} value={value} delay={0.1} />
                            ))}
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