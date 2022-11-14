import fs from "fs";
import Paths from "../util/Paths";
import Config from "../util/Config";
import sharp from "sharp";

export default class IconsBuild {

    static buildTokenIcons(tokenRri: string): boolean {
        const resourceMap = this.getResources(Paths.tokenSources(tokenRri));
        let hasSvg = resourceMap[Paths.SVG];
        let hasPng = resourceMap[Paths.PNG];

        if (!hasPng && !hasSvg) {
            throw new Error("Missing both `" + Paths.SVG + "` and `" + Paths.PNG + "` for token " + tokenRri + "!");
        }

        fs.mkdirSync(Paths.targetIcons(tokenRri), {recursive: true});
        const logoFile = hasPng ? Paths.PNG : Paths.SVG;

        this.transformIcon(Paths.SOURCE + tokenRri, logoFile, Config.DIMENSIONS_TOKEN,
            Paths.targetIcons(tokenRri), Paths.pngName, resourceMap);

        return !!hasSvg;
    }

    static buildAccountIcons(logoFile: string, resourceMap: Record<string, boolean | undefined>): void {
        const filePrefix = logoFile.substring(0, logoFile.length - 4);

        this.transformIcon(Paths.ACC_LOGOS, logoFile, Config.DIMENSIONS_ACCOUNT,
            Paths.TARGET_ACC_ICONS, (dimension) => filePrefix + "-x" + dimension + ".png", resourceMap);
    }

    private static transformIcon(sourceDir: string, logoFile: string, dimensions: number[], targetDir: string,
                                 nameFunc: (dimension: number) => string, resourceMap: Record<string, boolean | undefined>): void {
        const logoFullPath = sourceDir + "/" + logoFile;
        if (logoFile.endsWith(".svg")) {
            fs.copyFileSync(logoFullPath, targetDir + "/" + logoFile);
        }
        fs.open(logoFullPath, "r", async (err, fd) => {
            if (err) throw err;

            try {
                const buff = fs.readFileSync(fd);
                if (buff.length <= 1) {
                    throw new Error("Is the file empty? " + logoFullPath);
                }
                for (const dimension of dimensions) {
                    const pngName = nameFunc(dimension);
                    const destFile = targetDir + "/" + pngName;
                    if (resourceMap[pngName]) {
                        fs.copyFileSync(sourceDir + "/" + pngName, destFile);
                    } else {
                        let sh = sharp(buff);
                        const meta = await sh.metadata();
                        if (meta.width !== dimension || meta.height !== dimension) {
                            sh = sh.resize({width: dimension, height: dimension, withoutEnlargement: true});
                        }
                        await sh
                            .png({palette: true, effort: 10, compressionLevel: 9})
                            // .withMetadata()
                            .toFile(destFile);
                    }
                }
            } finally {
                fs.close(fd, (err) => {
                    if (err) throw err;
                });
            }
        });
    }


    static getResources(path: string): Record<string, boolean | undefined> {
        const resourceMap: Record<string, boolean | undefined> = {};
        const tokenResources = fs.readdirSync(path);
        for (const fileName of tokenResources) {
            resourceMap[fileName] = true;
        }
        return resourceMap;
    }


}
