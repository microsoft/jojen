import Rule from '../types/rule';
import { async } from '../util';

class AlternativesValidator extends Rule {
    public compile(params) {
        const arr = params.args[0];
        if (Array.isArray(arr)) {
            this._schemas = arr;
        } else {
            this._schemas = [];
        }
    }

    public validate(params, callback) {
        const schemaChecks = this._schemas.map(schema =>
            done => params.validator.validate(params.value, schema, params.options, done)
        );

        async.some(schemaChecks, callback);
    }

    private _add(alts) {
        this._schemas = this._schemas.concat(alts);
    }

    public static ruleName() {
        return 'alternatives';
    }
}

class Try extends Rule {
    operates() {
        return false;
    }

    compile(params) {
        params.invokeLast(AlternativesValidator, v => {
            v._add(params.args);
        });
    }

    static ruleName() {
        return 'alternatives.try';
    }
}

module.exports = [AlternativesValidator, Try];
