import { IImageDetails } from "../../../webparts/imageCarousel/components/IImageCarouselProps";

export interface ICarouselProps {
    isAutoRotate: boolean;  // flag to enable the auto-rotation
    duration: number;     // Time in miliseconds for the autorotation
    imagesCount: number;    // NUmber of images to be shown
    showCaptions: boolean;  // Flag to show the captions
    images?: IImageDetails; // Images details
    height: number;         // Height of the carousel
    width: number;          // Width of the carousel
}