import { AccountTag } from "../common/AccountTag";

export default class ProjectAccountInfo {
    title: string;
    tags: AccountTag[];
    svg?: boolean;


    constructor(tags: AccountTag[], title: string, svg?: boolean) {
        this.title = title;
        this.tags = tags;
        this.svg = svg;
    }
}
