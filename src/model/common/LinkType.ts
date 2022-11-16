export enum LinkTypeEnum {
    blog,
    coingecko,
    cmc,
    discord,
    docs,
    facebook,
    instagram,
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
