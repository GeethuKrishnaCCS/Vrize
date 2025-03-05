import * as React from 'react';
import styles from './Story.module.scss';
import { IStoryConfig } from '../types/Types';

export interface IStoryProps {
    config: IStoryConfig;
}

export const Story: React.FunctionComponent<IStoryProps> = (props: React.PropsWithChildren<IStoryProps>) => {
    const storyData = props.config

    if (!storyData) {
        return null;
    }

    return (
        <section className={styles.storySection}>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <img
                        src={storyData.image.src}
                        alt={storyData.image.alt}
                        className={styles.storyImage}
                    />
                </div>
                <article className={styles.textContent}>
                    {storyData.paragraphs.map((paragraph: string, index: number) => (
                        <p key={index} className={styles.storyParagraph}
                            dangerouslySetInnerHTML={{ __html: paragraph }} />
                    ))}
                </article>
            </div>
        </section>
    );

};