import { LinkType } from "./LinkType";

export class Link {
    /**
     * Type of the link (determines the display icon)
     */
    type: LinkType;
    /**
     * The url itself
     * @TJS-format uri
     */
    url: string;
    /**
     * Optional - title.
     * Advised to specify when there are two or more links with the same type
     */
    title?: string;

    constructor(type: LinkType, url: string, title: string) {
        this.type = type;
        this.url = url;
        this.title = title;
    }
}
