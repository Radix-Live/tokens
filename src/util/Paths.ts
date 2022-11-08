export default class Paths {
    static SOURCE = "resources/";
    static TARGET = "generated/";

    static JSON = "info.json5";
    static SVG = "logo.svg";
    static PNG = "logo.png";

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

    static targetIcon(tokenRri: string, name: string): string {
        return this.targetIcons(tokenRri) + "/" + name;
    }

    static targetSvg(tokenRri: string): string {
        return this.targetIcon(tokenRri, this.SVG);
    }

    static pngName(dimension: number): string {
        return "logo-x" + dimension + ".png";
    }

}
