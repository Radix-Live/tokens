import * as fs from "fs";
import { readFileSync } from "fs";
import JSON5 from "json5";
import { TokenValidator } from "./json/TokenValidator";
import Paths from "./util/Paths";

const start = Date.now();

const validator = new TokenValidator();

let files = fs.readdirSync(Paths.SOURCE);

let failedTokens: string[] = [];
for (const tokenRri of files) {
    if (!tokenRri.startsWith(".") && tokenRri.indexOf('_') > 1) {
        const tokenFile = readFileSync(Paths.sourceJson(tokenRri));
        const errs = validator.validate(tokenRri, JSON5.parse(tokenFile.toString()));

        if (!fs.existsSync(Paths.sourceSvg(tokenRri))
            && !fs.existsSync(Paths.sourcePng(tokenRri))) {
            errs.push("Logo icon is missing.");
        }

        if (errs.length) {
            failedTokens.push(tokenRri);
            console.error(tokenRri + " -> FAIL. Errors: \n" + errs.join("\n"));
        } else {
            console.log(tokenRri + " -> PASS");
        }
    }
}

console.log("Finished in: " + (Date.now() - start) / 1000 + "s");

if (failedTokens.length) {
    throw new Error("Validation failed for tokens: [" + failedTokens.join(", ") + "]");
} else {
    console.log("Validation passed.");
}
