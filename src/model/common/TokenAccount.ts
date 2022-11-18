import { AccountTag } from "./AccountTag";

export class TokenAccount {
    /**
     * @pattern ^rdx1[02-9ac-hj-np-z]{54}[cgqs][02-9ac-hj-np-z]{6}$
     */
    address: string;
    /**
     * Title
     */
    title: string;
    /**
     * At least one tag is required for non-circulating accounts.
     * @uniqueItems true
     */
    tags: AccountTag[];
    /**
     * Whether to include the Project Tokens in this account's balance into the Circulating Supply.
     */
    circulating?: boolean = false;

    constructor(address: string, tags: AccountTag[], title: string, circulating: boolean) {
        this.address = address;
        this.tags = tags;
        this.title = title;
        this.circulating = circulating;
    }
}
