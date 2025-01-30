import styles from "./HolidayCard.module.scss";
import * as React from "react";

interface HolidayCardProps {
    Date: string;
    Title: string;
    filteredListUrl: string
}

export const HolidayCard = ({ Date: dateStr, Title, filteredListUrl }: HolidayCardProps) => {
    const date = new Date(dateStr); // Convert string to Date object

    if (isNaN(date.getTime())) {
        return <div className={styles.card}>Invalid Date</div>; // Handle invalid dates
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <div className={styles.dateSection}>
                    <div className={styles.day}>
                        {date.getDate()}
                    </div>
                    <div className={styles.monthYear}>
                        {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </div>
                    <h2 className={styles.holidayName}>{Title}</h2>
                </div>
                <div className={styles.icon}>
                    <a href={filteredListUrl} target="_blank" rel="noopener noreferrer">
                        <img src={"../assets/icon-bold-arrow-up.svg"} alt="icon" />
                    </a>
                </div>
            </div>
        </div>
    );
};
