export default class Strings {
    static ADDR_REGEXP = /^rdx1[02-9ac-hj-np-z]{54}[cgqs][02-9ac-hj-np-z]{6}$/

    static capitalize(s: string): string {
        return s && s.charAt(0).toUpperCase() + s.substring(1);
    }
}
