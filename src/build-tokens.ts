import * as fs from "fs";
import { readFileSync } from "fs";
import JSON5 from "json5";
import { TokenInfo } from "./model/model-out/TokenInfo";
import Paths from "./util/Paths";
import sharp from "sharp";
import Config from "./util/Config";

const start = Date.now();

if (fs.existsSync(Paths.TARGET)) {
    fs.rmSync(Paths.TARGET, {recursive: true})
}
fs.mkdirSync(Paths.TARGET);
let files = fs.readdirSync(Paths.SOURCE);

let nonCirculatingAccounts: Record<string, string[]> = {};
let allTokens: Record<string, TokenInfo> = {};

function copyIcons(tokenRri: string): boolean {
    const resourceMap: Record<string, boolean> = {};
    const tokenResources = fs.readdirSync(Paths.tokenSources(tokenRri));
    for (const fileName of tokenResources) {
        resourceMap[fileName] = true;
    }
    let hasSvg = resourceMap[Paths.SVG];
    let hasPng = resourceMap[Paths.PNG];

    if (!hasPng && !hasSvg) {
        throw new Error("Missing both `" + Paths.SVG + "` and `" + Paths.PNG + "` for token " + tokenRri + "!");
    }

    fs.mkdirSync(Paths.targetIcons(tokenRri), {recursive: true});
    if (hasSvg) {
        fs.copyFileSync(Paths.sourceSvg(tokenRri), Paths.targetSvg(tokenRri));
    }
    const logoFile = hasPng ? Paths.sourcePng(tokenRri) : Paths.sourceSvg(tokenRri);
    fs.open(logoFile, "r", async (err, fd) => {
        if (err) throw err;

        try {
            const buff = fs.readFileSync(fd);
            if (buff.length <= 1) {
                throw new Error("Is the file empty? " + logoFile);
            }
            for (const dimension of Config.DIMENSIONS) {
                const pngName = Paths.pngName(dimension);
                const destFile = Paths.targetIcon(tokenRri, pngName);
                if (resourceMap[pngName]) {
                    fs.copyFileSync(Paths.sourceFile(tokenRri, pngName), destFile);
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
    return hasSvg;
}

for (const tokenRri of files) {
    if (!tokenRri.startsWith(".") && tokenRri.indexOf('_') > 1) {
        const tokenFile = readFileSync(Paths.sourceJson(tokenRri));
        const token: TokenInfo = JSON5.parse(tokenFile.toString());

        const hasSvg = copyIcons(tokenRri);
        token.hasSvg = hasSvg;

        nonCirculatingAccounts[tokenRri] = token.projectAccounts
            .filter(acc => !acc.circulating)
            .map(acc => acc.address);

        allTokens[tokenRri] = token;
    }
}

fs.writeFileSync(Paths.TARGET + "non-circulating-accounts.json", JSON.stringify(nonCirculatingAccounts));
fs.writeFileSync(Paths.TARGET + "tokens.json", JSON.stringify(allTokens));

console.log("Finished in: " + (Date.now() - start) / 1000 + "s");
