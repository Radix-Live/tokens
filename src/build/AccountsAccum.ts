import { TokenInfo } from "../model/out/TokenInfo";
import ProjectAccountInfo from "../model/out/ProjectAccountInfo";
import AccountsJson from "../model/in/AccountsJson";
import AccountInfo from "../model/out/AccountInfo";
import { Address, RRI } from "../model/common/Types";

export default class AccountsAccum {
    private accounts: Record<Address, Record<RRI, ProjectAccountInfo>> = {};
    private commonAccounts: Record<Address, AccountInfo> = {};
    private nonCirculating: Record<RRI, Address[]> = {};

    addInfo(fileName: string, accounts: AccountsJson): void {
        if (accounts.addresses) {
            const addresses = accounts.addresses!;
            for (const address in addresses) {
                const title = addresses[address];
                this.commonAccounts[address] = new AccountInfo(title, accounts.logo, accounts.tags);
            }
        } else {
            const address = fileName.substring(0, 65) as Address;
            const title = accounts.title!;
            this.commonAccounts[address] = new AccountInfo(title, accounts.logo, accounts.tags);
        }
    }

    addAccounts(tokenRri: RRI, token: TokenInfo): void {
        for (const account of token.projectAccounts) {
            const info = new ProjectAccountInfo(account.tags, account.title, account.circulating);
            this.addAccount(account.address as Address, tokenRri, info);
        }

        this.nonCirculating[tokenRri] = token.projectAccounts
            .filter(acc => !acc.circulating)
            .map(acc => acc.address);
    }

    private addAccount(addr: Address, tokenRri: RRI, info: ProjectAccountInfo): void {
        let accContext: Record<RRI, ProjectAccountInfo> = this.accounts[addr];
        if (!accContext) {
            accContext = {};
            this.accounts[addr] = accContext;
        }

        accContext[tokenRri] = info;
    }

    getAccounts(): Record<Address, Record<RRI, ProjectAccountInfo>> {
        return this.accounts;
    }

    getCommonAccounts(): Record<Address, AccountInfo> {
        return this.commonAccounts;
    }

    getNonCirculating(): Record<RRI, Address[]> {
        return this.nonCirculating;
    }
}
