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
        console.log(data);
        return data;


    }
    // Birthday Service
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
            .expand(expand).orderBy("ID", false)()
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