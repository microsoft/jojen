import Rule from '../types/rule';
import FlagRule from '../types/flagRule';
import { async } from '../util';

class AlternativesValidator extends Rule {
    compile(params) {
        const arr = params.args[0];
        if (Array.isArray(arr)) {
            this._schemas = arr;
        }
    }

    validate(params, callback) {
        const schemaChecks = this._schemas.map(schema =>
            done => params.validator.validate(params.value, schema, params.options, done)
        );

        async.some(schemaChecks, callback);
    }

    static ruleName() {
        return 'alternatives';
    }
}

class Try extends FlagRule {
    compile(params) {
        this.invokeLast(params, AlternativesValidator, v => {
            const target = v._schemas || [];
            target.push.apply(target, params.args);
            v._schemas = target;
        });
    }

    operates() {
        return false;
    }

    static ruleName() {
        return 'alternatives.try';
    }
}

module.exports = [AlternativesValidator, Try];
