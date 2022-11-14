import { TokenInfo } from "../model/model-out/TokenInfo";
import { Address, RRI } from "../model/model-out/Types";
import AccountInfo from "../model/model-out/AccountInfo";
import Accounts from "../model/Accounts";
import CommonAccountInfo from "../model/model-out/CommonAccountInfo";

export default class AccountsAccum {
    private accounts: Record<Address, Record<RRI, AccountInfo>> = {};
    private commonAccounts: Record<Address, CommonAccountInfo> = {};
    private nonCirculating: Record<RRI, Address[]> = {};

    addInfo(fileName: string, accounts: Accounts): void {
        if (accounts.addresses) {
            const addresses = accounts.addresses!;
            for (const address in addresses) {
                const title = addresses[address];
                this.commonAccounts[address] = new CommonAccountInfo(title, accounts.logo, accounts.tags);
            }
        } else {
            const address = fileName.substring(0, 65) as Address;
            const title = accounts.title!;
            this.commonAccounts[address] = new CommonAccountInfo(title, accounts.logo, accounts.tags);
        }
    }

    addAccounts(tokenRri: RRI, token: TokenInfo): void {
        for (const account of token.projectAccounts) {
            const info = new AccountInfo(account.tags, account.title, account.circulating);
            this.addAccount(account.address as Address, tokenRri, info);
        }

        this.nonCirculating[tokenRri] = token.projectAccounts
            .filter(acc => !acc.circulating)
            .map(acc => acc.address);
    }

    private addAccount(addr: Address, tokenRri: RRI, info: AccountInfo): void {
        let accContext: Record<RRI, AccountInfo> = this.accounts[addr];
        if (!accContext) {
            accContext = {};
            this.accounts[addr] = accContext;
        }

        accContext[tokenRri] = info;
    }

    getAccounts(): Record<Address, Record<RRI, AccountInfo>> {
        return this.accounts;
    }

    getCommonAccounts(): Record<Address, CommonAccountInfo> {
        return this.commonAccounts;
    }

    getNonCirculating(): Record<RRI, Address[]> {
        return this.nonCirculating;
    }
}
