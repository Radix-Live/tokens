import * as fs from "fs";
import { readFileSync } from "fs";
import JSON5 from "json5";
import { TokenInfo } from "./model/out/TokenInfo";
import Paths from "./util/Paths";
import IconsBuild from "./build/IconsBuild";
import AccountsAccum from "./build/AccountsAccum";
import AccountsJson from "./model/in/AccountsJson";
import { RRI } from "./model/common/Types";
import AccountsBundle from "./model/out/AccountsBundle";

const start = Date.now();

const storeJson = <T>(name: string, o: T): void => {
    // noinspection TypeScriptValidateJSTypes
    fs.writeFileSync(Paths.TARGET + name + ".json", JSON.stringify(o, undefined, 2));
};

if (fs.existsSync(Paths.TARGET)) {
    fs.rmSync(Paths.TARGET, {recursive: true})
}
fs.mkdirSync(Paths.TARGET);
fs.mkdirSync(Paths.TARGET_ACC_ICONS);

let allTokens: Record<string, TokenInfo> = {};
let accAccum: AccountsAccum = new AccountsAccum();

for (const tokenRri of fs.readdirSync(Paths.SOURCE)) {
    if (!tokenRri.startsWith(".") && tokenRri.indexOf('_') > 1) {
        const tokenFile = readFileSync(Paths.sourceJson(tokenRri));
        const token: TokenInfo = JSON5.parse(tokenFile.toString());

        // correct optional fields:
        if (!token.aliases) {
            token.aliases = [];
        }

        token.hasSvg = IconsBuild.buildTokenIcons(tokenRri);

        accAccum.addProjectAccounts(tokenRri as RRI, token);

        allTokens[tokenRri] = token;
    }
}
const allLogos = IconsBuild.getResources(Paths.ACC_LOGOS);
for (const fileName of fs.readdirSync(Paths.ACC_INFO)) {
    if (!fileName.startsWith(".")) {
        const accountsFile = readFileSync(Paths.ACC_INFO + "/" + fileName);
        const accounts: AccountsJson = JSON5.parse(accountsFile.toString());

        IconsBuild.buildAccountIcons(accounts.logo, allLogos);

        accAccum.addInfo(fileName, accounts);
    }
}

storeJson("tokens", allTokens);
storeJson("non-circulating-accounts", accAccum.getNonCirculating());
storeJson("accounts", new AccountsBundle(
    accAccum.getCommonAccounts(), accAccum.getProjectAccounts()
));

console.log("Finished in: " + (Date.now() - start) / 1000 + "s");
