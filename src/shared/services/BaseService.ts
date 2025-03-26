import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp/presets/all";
import { getSP } from "../PnP/pnpjsConfig";
import "@pnp/sp/attachments";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists"
import "@pnp/sp/fields";

export class BaseService {
    private sp: SPFI;
    constructor(context: WebPartContext, siteUrl: string) {
        this.sp = getSP(context);
    }
    public getCurrentUser() {
        return this.sp.web.currentUser();
    }
    public getListItems(url: string): Promise<any> {
        return this.sp.web.getList(url).items.orderBy("ID", false)();
    }
    public addListItem(url: string, data: any): Promise<any> {
        return this.sp.web.getList(url).items.add(data);
    }
    public updateItem(url: string, data: any, id: number): Promise<any> {
        return this.sp.web.getList(url).items.getById(id).update(data);
    }
    public getItemsSelect(queryurl: string, select: string): Promise<any> {
        return this.sp.web.getList(queryurl).items
            .select(select).orderBy("ID", false)();
    }
    // Image Carousel Service
    public getImageItems(url: string, selectquery: string): Promise<any> {
        return this.sp.web.getList(url).items.select(selectquery)();
    }
    // Forms and Templates Service
    public async getGroupUsers(context: any, groupName: string): Promise<any> {
        const filterQuery = `displayName eq '${groupName}'`;
        const client = await context.msGraphClientFactory.getClient("3");
        const group = await client
            .api('/groups')
            .filter(filterQuery) // Apply the filter query here
            .version('v1.0')
            .get();
        let groupid = group.value[0].id;
        const response = await client
            .api(`/groups/${groupid}/members`)
            .version('v1.0')
            .get();
        let data = response.value;
        return data;
    }

    public getItemSelectExpandOrderBy(siteUrl: string, select: string, expand: string, Orderby: string): Promise<any> {
        return this.sp.web.getList(siteUrl).items
            .select(select)
            .expand(expand)
            .orderBy(Orderby, true)
            ()
    }

    //Birthday Carousel
    public getBirthdayCarouselItemSelectExpandOrderBy(
        siteUrl: string,
        select: string,
        expand: string,
        Orderby: string
    ): Promise<any> {
        return this.sp.web.getList(siteUrl)
            .items.select(select).expand(expand).orderBy(Orderby, true)() // Ensure `()` to execute the query
            .then((items: any) => {
                // Function to get today's date in UTC
                const getUTCDate = (date: any) => {
                    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                };

                // Get current UTC date
                const today = getUTCDate(new Date());
                const todayMonth = today.getUTCMonth() + 1;
                const todayDay = today.getUTCDate();

                // Get UTC date after 14 days
                const futureDate = new Date(today);
                futureDate.setUTCDate(today.getUTCDate() + 14);
                const futureMonth = futureDate.getUTCMonth() + 1;
                const futureDay = futureDate.getUTCDate();

                // Filter birthdays within the next 14 days
                const upcomingBirthdays = items.filter((item: any) => {
                    const birthday = new Date(item.BirthdayText);
                    const birthMonth = birthday.getMonth() + 1;
                    // const birthDay = birthday.getUTCDate();
                    const birthDay = birthday.getDate();
                    const todayValue = todayMonth * 100 + todayDay;
                    const futureValue = futureMonth * 100 + futureDay;
                    const birthValue = birthMonth * 100 + birthDay;
                    return (
                        // (birthMonth === todayMonth && birthDay >= todayDay) &&
                        // (birthMonth === futureMonth && birthDay <= futureDay)

                        // (birthMonth === todayMonth && birthDay >= todayDay) &&
                        // (birthMonth < futureMonth || 
                        // (birthMonth === futureMonth && birthDay <= futureDay))
                        birthValue >= todayValue && birthValue <= futureValue
                    );
                });

                console.log("Upcoming Birthdays:", upcomingBirthdays);
                return upcomingBirthdays; // Return the filtered results
            })
            .catch((error: any) => {
                console.error("Error fetching birthdays:", error);
                throw error; // Ensure the error propagates
            });
    }


    // Birthday Service
    public getBirthdaysUntilDate(
        siteUrl: string,
        select: string,
        expand: string,
        orderBy: string,
        endDateStr: string // End date as a string in "DD-MM" format
    ): Promise<any> {
        return this.sp.web.getList(siteUrl)
            .items.select(select).expand(expand).orderBy(orderBy, true).top(1000)() //
            .then((items: any) => {
                // Function to get today's UTC date
                const getUTCDate = (date: Date) => {
                    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                };

                // Get today's UTC date
                const today = getUTCDate(new Date());
                const todayMonth = today.getUTCMonth() + 1;
                const todayDay = today.getUTCDate();

                // Parse the end date string and get the future UTC date
                const [endDay, endMonth] = endDateStr.split("-").map(Number);
                const futureDate = new Date(today.getFullYear(), endMonth - 1, endDay);
                const futureMonth = futureDate.getUTCMonth() + 1;
                const futureDay = futureDate.getUTCDate();


                // Filter birthdays within the given date range
                const upcomingBirthdays = items.filter((item: any) => {
                    const birthday = new Date(item.BirthdayText);
                    // const birthMonth = birthday.getUTCMonth() + 1;
                    // const birthDay = birthday.getUTCDate();


                    const birthMonth = birthday.getMonth() + 1;
                    // const birthDay = birthday.getUTCDate();
                    const birthDay = birthday.getDate();
                    const todayValue = todayMonth * 100 + todayDay;
                    const futureValue = futureMonth * 100 + futureDay;
                    const birthValue = birthMonth * 100 + birthDay;


                    return (
                        // (birthMonth >= todayMonth && birthDay >= todayDay) &&
                        // (birthMonth <= futureMonth && birthDay <= futureDay)

                        birthValue >= todayValue && birthValue <= futureValue
                    );
                });

                console.log(`Upcoming Birthdays until ${endDateStr}:`, upcomingBirthdays);
                return upcomingBirthdays; // Return the filtered results
            })
            .catch((error: any) => {
                console.error("Error fetching birthdays:", error);
                throw error; // Ensure the error propagates
            });
    }
    public getdefaultImage(url: string): Promise<any> {
        return this.sp.web.getList(url).items.select("FileLeafRef", "FileRef").filter("DefaultType eq 'Birthday'")();
    }

    public getItemsFilter(queryurl: string, filter: string): Promise<any> {
        return this.sp.web.getList(queryurl).items.filter(filter)()
    }
    public async uploadDocument(libraryName: string, Filename: any, filedata: any): Promise<any> {
        const response = await this.sp.web.getFolderByServerRelativePath(libraryName).files.addUsingPath(Filename, filedata, { Overwrite: true });
        return response
    }
    public async getFileContent(fileUrl: string): Promise<any> {
        return this.sp.web.getFileByServerRelativePath(fileUrl).getItem();
    }
    public async getUser(userId: number): Promise<any> {
        return this.sp.web.getUserById(userId)();
    }
    public async gettingUserProfiles(loginName: string): Promise<any> {
        try {
            if (!this.sp.profiles) {
                throw new Error("Profiles object is not initialized");
            }

            const [imageUrl, designation, fullName] = await Promise.all([
                this.sp.profiles.getUserProfilePropertyFor(loginName, "PictureURL"), // User Image
                this.sp.profiles.getUserProfilePropertyFor(loginName, "Title"), // Designation/Job Title
                this.sp.profiles.getUserProfilePropertyFor(loginName, "PreferredName"), // Full Name
            ]);

            return {
                imageUrl,
                designation,
                fullName,
            };
        } catch (error) {
            console.error("Error fetching user profiles:", error);
            throw error;
        }
    }
    public getItemsSelectExpand(queryurl: string, select: string, expand: string): Promise<any> {
        return this.sp.web.getList(queryurl).items
            .select(select)
            .expand(expand).orderBy("ID", false).top(1000)()
    }

    //My Teams
    public async getManagers(context: any): Promise<any> {
        const client = await context.msGraphClientFactory.getClient("3");
        const groupmembers = await client
            .api('me/manager')
            .version('v1.0')
            .get();

        return groupmembers;


    }
    public async getResponders(context: any): Promise<any> {
        const client = await context.msGraphClientFactory.getClient("3");
        const groupmembers = await client
            .api('me/directReports')
            .version('v1.0')
            .get();

        return groupmembers;


    }
}