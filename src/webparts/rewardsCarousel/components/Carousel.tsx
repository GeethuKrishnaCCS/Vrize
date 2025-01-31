import * as React from "react";
import styles from "./Carousel.module.scss";
import { ICarouselProps } from "./ICarouselProps";
import { SizeMe, SizeMeProps } from "react-sizeme";
import { PrimaryButton } from "@fluentui/react";

export class Carousel extends React.Component<
    ICarouselProps,
    {
        showSlideIndex?: number;
        interval?: ReturnType<typeof setInterval>;
        height: string;
        width: string;
    }
> {
    constructor(props: ICarouselProps, state: any) {
        super(props);

        this.state = {
            showSlideIndex: 0,
            interval: undefined, // Initialize as undefined
            height: String(this.props.height) + "%",
            width: String(this.props.width) + "%",
        };
        this.onViewAll = this.onViewAll.bind(this);
    }

    public componentDidMount(): void {
        this.startAutorotate();
    }
    public onViewAll() {
        const rewardsandbirthdaylink =
            this.props.siteurl +
            "/SitePages/RewardsAndBirthdays.aspx";
        window.open(rewardsandbirthdaylink, "_self", "noopener,noreferrer");
    }
    public render(): React.ReactElement<ICarouselProps> {
        return (
            <div className={styles.carousel}>
                <SizeMe>
                    {({ size }: SizeMeProps) => (
                        <div className={styles.slideshowContainer}>
                            {/*  Iterate over each item to generate the carousel */}
                            {this.props.employeesReward
                                ?.slice(0, this.props.employeesRewardCount)
                                .map((emp: any, index: any) => {
                                    return (
                                        <div
                                            onMouseEnter={() => this.stopAutorotate()}
                                            onMouseLeave={() => this.startAutorotate()}
                                            key={index.toString()}
                                            className={`${index === this.state.showSlideIndex
                                                ? styles.show
                                                : styles.mySlides
                                                } ${styles.fade}`}
                                        >
                                            <div className={styles.numbertext}>
                                                {index + 1}/{this.props.employeesRewardCount}
                                            </div>
                                            <div className={styles.card}>
                                                <div className={styles.heading}>
                                                    <div className={styles.pagetitle}>
                                                        {this.props.WebpartTitle}
                                                    </div>
                                                    <PrimaryButton
                                                        onClick={this.onViewAll}
                                                        className={styles.viewAll}
                                                    >
                                                        {" "}
                                                        View All
                                                    </PrimaryButton>
                                                </div>

                                                <div className={styles.cardcontent}>
                                                    <img
                                                        className={styles.imgWidth}
                                                        src={emp.ImageURL ?? ""}
                                                        alt="Image"
                                                    />
                                                    <div className={styles.details}>
                                                        <div className={styles.vrizer}>Vrizer</div>
                                                        <div className={styles.yearof}>of the year</div>
                                                        <div className={styles.name}>{emp.FullName}</div>
                                                        <div className={styles.designation}>
                                                            {emp.Designation}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            <a className={styles.prev} onClick={() => this.prevSlide()}>
                                &#10094;
                            </a>
                            <a className={styles.next} onClick={() => this.nextSlide()}>
                                &#10095;
                            </a>
                        </div>
                    )}
                </SizeMe>
            </div>
        );
    }

    public getSnapshotBeforeUpdate(
        prevProp: ICarouselProps,
        prevState: any
    ): any {
        if (
            prevProp.duration !== this.props.duration ||
            prevProp.isAutoRotate !== this.props.isAutoRotate
        ) {
            this.startAutorotate();
        }
        return null;
    }

    private nextSlide(): void {
        let nextSlide: number = Number(this.state.showSlideIndex) + 1;
        if (nextSlide > this.props.employeesRewardCount - 1) {
            nextSlide = 0;
        }
        this.setState({ showSlideIndex: nextSlide });
    }

    private prevSlide(): void {
        let nextSlide: number = Number(this.state.showSlideIndex) - 1;
        if (nextSlide < 0) {
            nextSlide = this.props.employeesRewardCount - 1;
        }
        this.setState({ showSlideIndex: nextSlide });
    }

    private stopAutorotate(): void {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }
    }

    private startAutorotate(): void {
        this.stopAutorotate();

        if (this.props.isAutoRotate) {
            const interval = setInterval(() => {
                this.nextSlide();
            }, this.props.duration);

            this.setState({ interval });
        }
    }
}
