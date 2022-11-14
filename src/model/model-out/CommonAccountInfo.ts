import { AccountTag } from "../AccountTag";

export default class CommonAccountInfo {
    title: string;
    logo: string;
    tags: AccountTag[];

    constructor(title: string, logo: string, tags: AccountTag[]) {
        this.title = title;
        this.logo = logo;
        this.tags = tags;
    }
}
