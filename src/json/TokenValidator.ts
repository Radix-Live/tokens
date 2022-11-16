import { Draft, Draft07, JSONError } from "json-schema-library";
import { readFileSync } from "fs";
import { TokenJson } from "../model/in/TokenJson";

export class TokenValidator {
    private jsonSchema: Draft;
    private seenIds: Record<string, string> = {};

    constructor() {
        const content = readFileSync("schemas/token.schema.json");
        const schema = content.toString();
        this.jsonSchema = new Draft07(JSON.parse(schema));
    }

    public validate(rri: string, token: TokenJson): string[] {
        const errs: string[] = [];

        this.validateSchema(token, errs);
        if (!errs.length) {
            this.validateData(rri, token, errs);
        }

        return errs;
    }

    private validateSchema(token: TokenJson, errs: string[]): void {
        const errors: JSONError[] = this.jsonSchema.validate(token);

        if (errors.length) {
            for (const error of errors) {
                errs.push(error.message);
            }
        }
    }

    private validateData(rri: string, token: TokenJson, errs: string[]): void {
        const id = token.id.toLowerCase();
        const conflictingRRI = this.seenIds[id];
        if (conflictingRRI) {
            errs.push("ID is conflicting with: " + conflictingRRI);
        } else {
            this.seenIds[id] = rri;
        }

        if (token.name.length > 18 && !token.shortName) {
            errs.push("Name is longer than 18 characters and no shortName provided");
        }
        if (token.description.length > 127 && !token.shortDescription) {
            errs.push("Description is longer than 127 characters and no shortDescription provided");
        }
        // if (token.projectAccounts) {
        //     for (const acc of token.projectAccounts) {
        //         if (!acc.circulating && acc.tags.length === 0) {
        //             errs.push(acc.address + " -> At least one tag is required for non-circulating accounts.");
        //         }
        //     }
        // }

    }
}
