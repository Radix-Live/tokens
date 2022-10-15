export enum LinkTypeEnum {
    blog,
    coingecko,
    cmc,
    discord,
    docs,
    facebook,
    forum,
    github,
    medium,
    reddit,
    sources,
    telegram,
    twitter,
    whitepaper,
    youtube,

}

export type LinkType = keyof typeof LinkTypeEnum;
