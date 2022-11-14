import { Draft, Draft07, JSONError } from "json-schema-library";
import fs, { readFileSync } from "fs";
import Accounts from "../model/Accounts";
import Strings from "../util/Strings";
import Paths from "../util/Paths";

export class AccountsValidator {
    private jsonSchema: Draft;
    private availableLogos: Record<string, number | undefined> = {}; // number of usages
    private seenAddresses: Record<string, string> = {};

    constructor() {
        const content = readFileSync("schemas/accounts.schema.json");
        const schema = content.toString();
        this.jsonSchema = new Draft07(JSON.parse(schema));
        for (const fileName of fs.readdirSync(Paths.ACC_LOGOS)) {
            this.availableLogos[fileName] = 0;
        }
    }

    public validate(fileName: string, accounts: Accounts): string[] {
        const errs: string[] = [];

        this.validateSchema(accounts, errs);
        if (!errs.length) {
            this.validateData(fileName, accounts, errs);
        }

        return errs;
    }

    public getUnusedLogos(): string[] {
        const unused: string[] = [];
        for (const logo in this.availableLogos) {
            if (this.availableLogos[logo] === 0) {
                unused.push(logo);
            }
        }
        return unused;
    }

    private validateSchema(accounts: Accounts, errs: string[]): void {
        const errors: JSONError[] = this.jsonSchema.validate(accounts);

        if (errors.length) {
            for (const error of errors) {
                errs.push(error.message);
            }
        }
    }

    private validateData(fileName: string, accounts: Accounts, errs: string[]): void {
        const singleAcc = !!accounts.title;
        const multiAcc = !!accounts.addresses;
        if (singleAcc && multiAcc) {
            errs.push("Cannot combine fields `title` and `addresses`.");
            return;
        } else if (!singleAcc && !multiAcc) {
            errs.push("Missing required filed `title`.");
            return;
        }

        const usageCount = this.availableLogos[accounts.logo] as number;
        if (isNaN(usageCount)) {
            errs.push("Logo `" + accounts.logo + "` is missing in \"" + Paths.ACC_LOGOS + "\".");
        } else {
            this.availableLogos[accounts.logo] = usageCount + 1;
        }

        if (singleAcc) {
            const address = fileName.substring(0, 65);
            const title = accounts.title!;
            this.validateAccount(fileName, address, title, errs);
        } else {
            const addresses = accounts.addresses!;
            for (const address in addresses) {
                const title = addresses[address];
                this.validateAccount(fileName, address, title, errs);
            }
        }
    }

    private validateAccount(fileName: string, address: string, title: string, errs: string[]) {
        if (!Strings.ADDR_REGEXP.test(address)) {
            errs.push("Invalid account address: " + address);
        }
        if (!title) {
            errs.push("Missing title for account: " + address);
        }
        if (title.length > 63) {
            errs.push("Title '" + title + "' for address " + address + " is longer than 63 characters.");
        }

        const conflictingAddr = this.seenAddresses[address];
        if (conflictingAddr) {
            errs.push("Address '" + address + "' is also defined in file: " + conflictingAddr);
        } else {
            this.seenAddresses[address] = fileName;
        }
    }
}
