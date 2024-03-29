export enum TokenTagEnum {
    "Layer 1",
    "Layer 2",
    analytics,
    cex,
    currency,
    defi,
    dex,
    fan,
    gambling,
    gamefi,
    governance,
    index,
    lending,
    meme,
    metaverse,
    nft,
    nsfw,
    oracle,
    play2earn,
    prediction,
    privacy,
    stablecoin,
    stock,
    storage,
    synthetics,
    wrapped,
    yield,
}

export declare type TokenTag = keyof typeof TokenTagEnum;
