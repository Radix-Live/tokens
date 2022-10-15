import { Draft, Draft07, JSONError } from "json-schema-library";
import { readFileSync } from "fs";
import { Token } from "../model/Token";

export class TokenValidator {
    private jsonSchema: Draft;

    constructor() {
        const content = readFileSync("schemas/token.schema.json");
        const schema = content.toString();
        this.jsonSchema = new Draft07(JSON.parse(schema));
    }

    public validate(token: Token): string[] {
        const errs: string[] = [];

        this.validateSchema(token, errs);
        if (!errs.length) {
            this.validateData(token, errs);
        }

        return errs;
    }

    private validateSchema(token: Token, errs: string[]): void {
        const errors: JSONError[] = this.jsonSchema.validate(token);

        if (errors.length) {
            for (const error of errors) {
                errs.push(error.message);
            }
        }
    }

    private validateData(token: Token, errs: string[]): void {
        // TODO
    }
}
