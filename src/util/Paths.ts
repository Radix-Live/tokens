export default class Paths {
    static SOURCE = "resources/";
    static ACC_INFO = "accounts/info";
    static ACC_LOGOS = "accounts/logos";

    static TARGET = "generated/";
    static TARGET_ACC_ICONS = this.TARGET + "account-icons/";

    static JSON = "info.json5";
    static LOGO = "logo";
    static SVG = this.LOGO + ".svg";
    static PNG = this.LOGO + ".png";

    static tokenSources(tokenRri: string): string {
        return this.SOURCE + tokenRri;
    }

    static sourceFile(tokenRri: string, name: string): string {
        return this.SOURCE + tokenRri + "/" + name;
    }

    static sourceJson(tokenRri: string): string {
        return this.sourceFile(tokenRri, this.JSON);
    }

    static sourcePng(tokenRri: string): string {
        return this.sourceFile(tokenRri, this.PNG);
    }

    static sourceSvg(tokenRri: string): string {
        return this.sourceFile(tokenRri, this.SVG);
    }

    static targetIcons(tokenRri: string): string {
        return this.TARGET + "icons/" + tokenRri;
    }

}
