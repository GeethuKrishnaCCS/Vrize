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
        return this.sp.web.getList(url).items();
    }
    public addListItem(url: string, data: any): Promise<any> {
        return this.sp.web.getList(url).items.add(data);
    }
    public getImageItems(url: string, selectquery: string): Promise<any> {
        return this.sp.web.getList(url).items.select(selectquery)();
    }
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


}