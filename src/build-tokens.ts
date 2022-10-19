import * as fs from "fs";
import { readFileSync } from "fs";
import JSON5 from "json5";
import { Token } from "./model/Token";

const start = Date.now();


let files = fs.readdirSync("resources");

let nonCirculatingAccounts: Record<string, string[]> = {};
let allTokens: Record<string, Token> = {};

for (const tokenRri of files) {
    if (!tokenRri.startsWith(".") && tokenRri.indexOf('_') > 1) {
        const tokenFile = readFileSync("resources/" + tokenRri + "/info.json5");
        let token: Token = JSON5.parse(tokenFile.toString());

        nonCirculatingAccounts[tokenRri] = token.projectAccounts
            .filter(acc => !acc.circulating)
            .map(acc => acc.address);

        allTokens[tokenRri] = token;
    }
}

fs.mkdirSync("generated");
fs.writeFileSync("generated/non-circulating-accounts.json", JSON.stringify(nonCirculatingAccounts));
fs.writeFileSync("generated/tokens.json", JSON.stringify(allTokens));

console.log("Finished in: " + (Date.now() - start) / 1000 + "s");
