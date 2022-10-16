export enum AccountTagEnum {
    /**
     * Radix Foundation
     */
    foundation,
    /**
     * Team's allocation
     */
    team,
    /**
     * General funds in custody of the Project
     */
    project,
    /**
     * Funds designated for future spending
     */
    treasury,
    /**
     * CEX or DEX account (user funds)
     */
    exchange,
    /**
     * Bridge reserves
     */
    bridge,
    /**
     * None of the above
     */
    other,
}

export declare type AccountTag = keyof typeof AccountTagEnum;
