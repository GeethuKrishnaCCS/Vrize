
export interface ICarouselProps {
    isAutoRotate: boolean;  // flag to enable the auto-rotation
    duration: number;     // Time in miliseconds for the autorotation
    employeesRewardCount: number;    // NUmber of images to be shown
    showCaptions: boolean;  // Flag to show the captions
    employeesReward: any[]; // Images details
    height: number;         // Height of the carousel
    width: number;         // Width of the carousel
    columnSection: string;  // Column section
    siteurl: any;
    WebpartTitle: string;
}