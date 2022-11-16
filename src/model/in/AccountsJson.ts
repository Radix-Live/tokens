import { AddressWithTitle } from "../common/Types";
import { AccountTag } from "../common/AccountTag";

/**
 * Schema for the Accounts info file.
 * Either title (for a single account file) or addresses (for a multiple accounts file) is required.
 */
export default class AccountsJson {
    /**
     * Title
     */
    title?: string;
    /**
     * <address, title>.
     *
     * @pattern ^rdx1[02-9ac-hj-np-z]{54}[cgqs][02-9ac-hj-np-z]{6}$
     */
    addresses?: AddressWithTitle;
    /**
     * Logo icon including extension (SVG or PNG). PNG will be downsized if needed.
     */
    logo: string;
    /**
     * Account tags.
     * @uniqueItems true
     */
    tags: AccountTag[];

    constructor(title: string, addresses: Record<string, string>, logo: string, tags: AccountTag[]) {
        this.title = title;
        this.addresses = addresses;
        this.logo = logo;
        this.tags = tags;
    }
}
