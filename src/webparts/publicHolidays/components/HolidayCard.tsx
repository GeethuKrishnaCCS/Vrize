import styles from "./HolidayCard.module.scss";
import * as React from "react";

interface HolidayCardProps {
    Date: string;
    Title: string;
    filteredListUrl: string
}

export const HolidayCard = ({ Date: dateStr, Title, filteredListUrl }: HolidayCardProps) => {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        return <div className={styles.card}>Invalid Date</div>;
    }

    return (
        <div className={styles.card}>
            <h1>{'Upcoming Holidays'}</h1>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.854 10.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};
