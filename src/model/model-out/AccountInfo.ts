import { AccountTag } from "../AccountTag";

export default class AccountInfo {
    title?: string;
    tags: AccountTag[];
    circulating?: boolean;


    constructor(tags: AccountTag[], title?: string, circulating?: boolean) {
        this.title = title;
        this.tags = tags;
        this.circulating = circulating;
    }
}
