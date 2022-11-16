export declare type RRI = string;
export declare type Address = string;

export declare type AddressWithTitle = {
    /**
     * <address, title>.
     * @patternProperties ^rdx1[02-9ac-hj-np-z]{54}[cgqs][02-9ac-hj-np-z]{6}$
     */
    [key: string]: string;
};
