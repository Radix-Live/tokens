import { Token } from "../Token";
import { Link } from "../Link";
import { TokenTag } from "../TokenTag";
import { TokenAccount } from "../TokenAccount";

export class TokenInfo extends Token {
    hasSvg: boolean;

    constructor(id: string, name: string, shortName: string, aliases: string[], website: string, infoUrl: string, description: string,
                shortDescription: string, links: Link[], tags: TokenTag[], maxSupply: number, projectAccounts: TokenAccount[], hasSvg: boolean) {
        super(id, name, shortName, aliases, website, infoUrl, description, shortDescription, links, tags, maxSupply, projectAccounts);
        this.hasSvg = hasSvg;
    }
}
