import { AccountTag } from "../common/AccountTag";

export default class AccountInfo {
    title: string;
    logo: string;
    tags: AccountTag[];

    constructor(title: string, logo: string, tags: AccountTag[]) {
        this.title = title;
        this.logo = logo;
        this.tags = tags;
    }
}
