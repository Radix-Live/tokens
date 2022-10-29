import { Link } from "./Link";
import { TokenTag } from "./TokenTag";
import { Account } from "./Account";

export class Token {
    /**
     * Desired display name (full)
     * @minLength 1
     * @maxLength 63
     */
    name: string;
    /**
     * Short name, up to 18 characters (most emojis counts as 2 chars)
     * @minLength 1
     * @maxLength 18
     */
    shortName?: string;
    /**
     * Aliases for search (optional)
     * @uniqueItems true
     * @items.minLength 1
     * @items.maxLength 63
     */
    aliases?: string[];
    /**
     * Project website URL
     * @TJS-format uri
     */
    website: string;
    /**
     * Token info page URL (if available)
     * @TJS-format uri
     */
    infoUrl?: string;
    /**
     * Project description (full)
     * @minLength 1
     * @maxLength 511
     */
    description: string;
    /**
     * Short description, required if full description is longer than 127 characters
     * @minLength 1
     * @maxLength 127
     */
    shortDescription?: string;
    /**
     * A list of links to socials
     */
    links: Link[];
    /**
     * At least one tag required.
     * @minItems 1
     * @uniqueItems true
     */
    tags: TokenTag[];
    /**
     * Maximum supply, required for mutable tokens
     * @minimum 0
     */
    maxSupply?: number;
    /**
     * A list of accounts associated with the Project.
     * Required for circulating supply calculation, but other accounts can be also mentioned here (e.g. CeDEX accounts).
     * By default, they are considered non-circulating - add `circulating: true` to avoid this.
     */
    projectAccounts: Account[];

    constructor(name: string, shortName: string, aliases: string[], website: string, infoUrl: string,
                description: string, shortDescription: string, links: Link[], tags: TokenTag[],
                maxSupply: number, projectAccounts: Account[]) {
        this.name = name;
        this.shortName = shortName;
        this.aliases = aliases;
        this.website = website;
        this.infoUrl = infoUrl;
        this.description = description;
        this.shortDescription = shortDescription;
        this.links = links;
        this.tags = tags;
        this.maxSupply = maxSupply;
        this.projectAccounts = projectAccounts;
    }
}
