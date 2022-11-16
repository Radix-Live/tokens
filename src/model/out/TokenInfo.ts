import { TokenAccount } from "../common/TokenAccount";
import { Link } from "../common/Link";
import { TokenTag } from "../common/TokenTag";
import { TokenJson } from "../in/TokenJson";

export class TokenInfo extends TokenJson {
    hasSvg: boolean;

    constructor(id: string, name: string, shortName: string, aliases: string[], website: string, infoUrl: string, description: string,
                shortDescription: string, links: Link[], tags: TokenTag[], maxSupply: number, projectAccounts: TokenAccount[], hasSvg: boolean) {
        super(id, name, shortName, aliases, website, infoUrl, description, shortDescription, links, tags, maxSupply, projectAccounts);
        this.hasSvg = hasSvg;
    }
}
