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
    Date: string;
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
        limitToDate: Date,
        currentLocation: string,
        rowCount?: number
    ): Promise<IPublicHoliday[]> {
        let publicHolidays: IPublicHoliday[] = [];

        try {
            const formattedlimitDate = limitToDate.toISOString();
            const today = new Date().toDateString();

            publicHolidays = await this.sp.web.lists
                .getByTitle(listName)
                .items
                .filter(`Date ge '${today}' and Date lt '${formattedlimitDate}' and OfficeLocation eq '${currentLocation}'`)
                .top(rowCount || 100)
                ();
        }
        catch (error) {
            return Promise.reject(error);
        }

        return publicHolidays;
    }
}