import * as fs from "fs";
import { readFileSync } from "fs";
import JSON5 from "json5";
import { TokenInfo } from "./model/model-out/TokenInfo";
import Paths from "./util/Paths";
import IconsBuild from "./build/IconsBuild";
import AccountsAccum from "./build/AccountsAccum";
import { RRI } from "./model/model-out/Types";
import Accounts from "./model/Accounts";

const start = Date.now();

if (fs.existsSync(Paths.TARGET)) {
    fs.rmSync(Paths.TARGET, {recursive: true})
}
fs.mkdirSync(Paths.TARGET);
fs.mkdirSync(Paths.TARGET_ACC_ICONS);

let allTokens: Record<string, TokenInfo> = {};
let accAccum:AccountsAccum = new AccountsAccum();

for (const tokenRri of fs.readdirSync(Paths.SOURCE)) {
    if (!tokenRri.startsWith(".") && tokenRri.indexOf('_') > 1) {
        const tokenFile = readFileSync(Paths.sourceJson(tokenRri));
        const token: TokenInfo = JSON5.parse(tokenFile.toString());

        const hasSvg = IconsBuild.buildTokenIcons(tokenRri);
        token.hasSvg = hasSvg;

        accAccum.addAccounts(tokenRri as RRI, token);

        allTokens[tokenRri] = token;
    }
}
const allLogos = IconsBuild.getResources(Paths.ACC_LOGOS);
for (const fileName of fs.readdirSync(Paths.ACC_INFO)) {
    if (!fileName.startsWith(".")) {
        const accountsFile = readFileSync(Paths.ACC_INFO + "/" + fileName);
        const accounts: Accounts = JSON5.parse(accountsFile.toString());

        IconsBuild.buildAccountIcons(accounts.logo, allLogos);

        accAccum.addInfo(fileName, accounts);
    }
}

fs.writeFileSync(Paths.TARGET + "tokens.json", JSON.stringify(allTokens));
fs.writeFileSync(Paths.TARGET + "non-circulating-accounts.json", JSON.stringify(accAccum.getNonCirculating()));
fs.writeFileSync(Paths.TARGET + "accounts.json", JSON.stringify(accAccum.getAccounts()));
fs.writeFileSync(Paths.TARGET + "common-accounts.json", JSON.stringify(accAccum.getCommonAccounts()));

console.log("Finished in: " + (Date.now() - start) / 1000 + "s");
