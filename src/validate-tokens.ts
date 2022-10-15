import * as fs from "fs";
import { readFileSync } from "fs";
import JSON5 from "json5";
import { TokenValidator } from "./json/TokenValidator";

const start = Date.now();

const validator = new TokenValidator();

let files = fs.readdirSync("resources");

let failedTokens: string[] = [];
for (const tokenRri of files) {
    if (!tokenRri.startsWith(".") && tokenRri.indexOf('_') > 1) {
        const tokenFile = readFileSync("resources/" + tokenRri + "/info.json5");
        const errs = validator.validate(JSON5.parse(tokenFile.toString()));
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
