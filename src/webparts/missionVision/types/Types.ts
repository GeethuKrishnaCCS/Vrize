export interface IStoryConfig {
    title: string;
    paragraphs: string[];
    image: {
        src: string;
        alt: string;
    };
}
export interface IMissionConfig {
    title: string;
    subtitle: string;
    text: string;
    image: {
        url: string;
        alt: string;
    };
}

export interface IVisionConfig {
    title: string;
    image: {
        url: string;
        alt: string;
    };
    visionMetrics: {
        icon: string;
        label: string;
    }[];
}

export interface ICoreValuesConfig {
    title: string;
    text: string;
    image: {
        url: string;
        alt: string;
    };
    values: {
        letter: string;
        title: string;
        description: string;
    }[];
};