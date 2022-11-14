import * as fs from "fs";
import { readFileSync } from "fs";
import JSON5 from "json5";
import { AccountsValidator } from "./json/AccountsValidator";
import { TokenValidator } from "./json/TokenValidator";
import Paths from "./util/Paths";

const start = Date.now();

console.log("Validating Tokens: ");

const validator = new TokenValidator();

let failedTokens: string[] = [];
for (const tokenRri of fs.readdirSync(Paths.SOURCE)) {
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

console.log("Validating Accounts: ");
const startAcc = Date.now();

const accValidator = new AccountsValidator();
let failedAccounts: string[] = [];
for (const fileName of fs.readdirSync(Paths.ACC_INFO)) {
    if (!fileName.startsWith(".")) {
        const accountsFile = readFileSync(Paths.ACC_INFO + "/" + fileName);
        const errs = accValidator.validate(fileName, JSON5.parse(accountsFile.toString()));

        if (errs.length) {
            failedAccounts.push(fileName);
            console.error(fileName + " -> FAIL. Errors: \n" + errs.join("\n"));
        } else {
            console.log(fileName + " -> PASS");
        }
    }
}

const unusedLogos = accValidator.getUnusedLogos();

const end = Date.now();
console.log("Finished in: " + ((end - start) / 1000) + "s (Tokens: " + ((startAcc - start) / 1000) +"s, Accounts: "+ ((end - startAcc) / 1000) + "s)");

if (failedTokens.length) {
    throw new Error("Validation failed for tokens: [" + failedTokens.join(", ") + "]");
} else if (failedAccounts.length) {
    throw new Error("Validation failed for accounts: [" + failedAccounts.join(", ") + "]");
} else if (unusedLogos.length) {
    throw new Error("Unused logo files: [" + unusedLogos.join(", ") + "]");
} else {
    console.log("Validation passed.");
}
