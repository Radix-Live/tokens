import { Address, RRI } from "../common/Types";
import AccountInfo from "./AccountInfo";
import ProjectAccountInfo from "./ProjectAccountInfo";

export default class AccountsBundle {
    commonAccounts: Record<Address, AccountInfo>;
    projectAccounts: Record<Address, Record<RRI, ProjectAccountInfo>>;

    constructor(commonAccounts: Record<Address, AccountInfo>, projectAccounts: Record<Address, Record<RRI, ProjectAccountInfo>>) {
        this.commonAccounts = commonAccounts;
        this.projectAccounts = projectAccounts;
    }
}
