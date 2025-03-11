import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp/presets/all";
import { getSP } from "../PnP/pnpjsConfig";
import "@pnp/sp/attachments";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists"
import "@pnp/sp/fields";


export interface IPublicHoliday {
    Title: string;
    OfficeLocation: string;
    StartDate: string;
    DateValue?: string;
    Image?: any;
    ImageValue?: string;
}

export class PublicHolidaysService {
    private sp: SPFI;
    constructor(context: WebPartContext) {
        this.sp = getSP(context);
    }

    public async getUpcomingPublicHolidaysByTitle(
        listName: string,
        currentLocation: string,
        limitToDate?: Date,
        rowCount?: number
    ): Promise<IPublicHoliday[]> {
        let publicHolidays: IPublicHoliday[] = [];

        try {
            const today = new Date().toDateString();
            let filterQuery = `StartDate ge '${today}' and Location eq '${currentLocation}' and HolidayType ne 'Optional'`;

            // Only add "Date lt" filter if limitToDate is provided
            if (limitToDate) {
                const formattedLimitDate = limitToDate.toISOString();
                filterQuery += ` and StartDate lt '${formattedLimitDate}'`;
            }
            publicHolidays = await this.sp.web.lists
                .getByTitle(listName)
                .items
                .filter(filterQuery)
                .top(rowCount || 100)
                .orderBy('StartDate', true)
                ();
        }
        catch (error) {
            return Promise.reject(error);
        }

        return publicHolidays;
    }
}