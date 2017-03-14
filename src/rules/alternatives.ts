import { RuleParams } from '../RuleParams';
import { Schema } from '../Schema';
import {
    IRuleValidationParams,
    NonOperatingRule,
    Rule,
} from '../types/Rule';
import { async } from '../util';

export class AlternativesValidator extends Rule {
    protected schemas: Schema[];
    public compile(params: RuleParams) {
        const arr = params.args[0];
        if (Array.isArray(arr)) {
            this.schemas = arr;
        } else {
            this.schemas = [];
        }
    }

    public validate(params: IRuleValidationParams<any, void>, callback: ((error: Error) => void)) {
        const schemaChecks = this.schemas.map(schema =>
            (done: (error: Error) => void) => params.validator.validate(params.value, schema, params.options, done),
        );

        async.some(schemaChecks, callback);
    }

    public add(alts: Schema[]) {
        this.schemas = this.schemas.concat(alts);
    }

    public static ruleName() {
        return 'alternatives';
    }

    public getErrorMessage(): string {
        return '';
    }
}

export class Try extends NonOperatingRule {
    public operates() {
        return false;
    }

    public compile(params: RuleParams) {
        params.invokeLast(AlternativesValidator, v => {
            v.add(params.args);
        });
    }

    public static ruleName() {
        return 'alternatives.try';
    }

    public getErrorMessage(): string {
        return '';
    }
}
