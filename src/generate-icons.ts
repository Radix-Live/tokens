import * as fs from "fs";
import sharp from "sharp";
import Paths from "./util/Paths";

const start = Date.now();

const destDir = "icons-test";


async function buildLogos(sourceFd: number, tokenRri: string, svg: boolean, fileName: string) {
    try {
        const buff = fs.readFileSync(sourceFd);
        if (buff.length <= 1) {
            throw new Error("Is the file empty? " +  fileName);
        }
        fs.mkdirSync(destDir + "/" + tokenRri, {recursive: true});
        const dimensions = [32, 64, 128, 512];
        for (const dimension of dimensions) {
            const overrideFile = "resources/" + tokenRri + "/logo-x" + dimension +  ".png";
            const destFile = destDir + "/" + tokenRri + "/logo-x" + dimension +  ".png";
            if (fs.existsSync(overrideFile)) {
                fs.copyFileSync(overrideFile, destFile);
            } else {
                await sharp(buff)
                    .resize({width: dimension, height: dimension})
                    .png()
                    .toFile(destFile);
            }
        }
        if (svg) {
            fs.copyFileSync(fileName, destDir + "/" + tokenRri + "/logo.svg");
        }
    } finally {
        fs.close(sourceFd, (err) => {
            if (err) throw err;
        });
    }
}

let files = fs.readdirSync(Paths.SOURCE);

if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, {recursive: true});
}
fs.mkdirSync(destDir);
for (const tokenRri of files) {
    if (tokenRri.startsWith(".")) {
        const pngFile = Paths.sourcePng(tokenRri);
        fs.open(pngFile, "r", async (err, fd) => {
            if (err && err.code !== 'ENOENT') {
                throw err;
            }
            let hasPng = !err;

            if (hasPng) {
                await buildLogos(fd, tokenRri, false, pngFile);
            } else {
                const svgFile = Paths.sourceSvg(tokenRri);
                fs.open(svgFile, "r", async (err, fd) => {
                    if (err && err.code !== 'ENOENT') {
                        throw err;
                    }
                    let hasSvg = !err;
                    if (!hasPng && !hasSvg) {
                        throw new Error("Missing both `logo.png` and `logo.svg` for token " + tokenRri + "!");
                    }

                    await buildLogos(fd, tokenRri, true, svgFile);
                });
            }
        });
    }
}

console.log("Finished in: " + (Date.now() - start) / 1000 + "s");
