import Rule from '../types/rule';
import { async } from '../util';
import { RuleParams } from '../RuleParams';
import { Schema } from '../Schema';

class AlternativesValidator extends Rule {
    protected schemas: Schema[];
    public compile(params: RuleParams) {
        const arr = params.args[0];
        if (Array.isArray(arr)) {
            this.schemas = arr;
        } else {
            this.schemas = [];
        }
    }

    public validate(params, callback) {
        const schemaChecks = this.schemas.map(schema =>
            done => params.validator.validate(params.value, schema, params.options, done)
        );

        async.some(schemaChecks, callback);
    }

    public add(alts: Schema[]) {
        this.schemas = this.schemas.concat(alts);
    }

    public static ruleName() {
        return 'alternatives';
    }
}

class Try extends Rule {
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
}

module.exports = [AlternativesValidator, Try];
