import Ruleset from './ruleset';
import Schema from './schema';

import rules from './rules';
import clone from 'lodash.clone';

const defaultOptions = Object.freeze({
    convert: true,
    _path: [],
    // todo(connor4312): fill out the rest of the Joi options
});

/**
 * The validator is the main entry point for building validation schemas.
 * You can .add() Rules to it, and also start building schemas (e.g.
 * Jo.required()) directly on the validator instance.
 */
export default class Validator {
    constructor() {
        this._ruleset = new Ruleset();
        this._schema = new Schema(this._ruleset);
        this.add(rules);
    }

    /**
     * Adds a new Rule or array of Rules to the validator.
     * @param {Rule|[]Rule} rules
     * @return Validator
     */
    add(rules) {
        if (!Array.isArray(rules)) {
            this.add([rules]);
        }

        rules.forEach((rule) => {
            this._ruleset.addRule(rule.ruleName().split('.'), rule);
        });

        this._schema = new Schema(this._ruleset);

        this._ruleset.buildChain(this, (method, child, args) => {
            return this._schema[method].apply(this._schema, args);
        });
    }

    /**
     * Validates the give value against the schema.
     * @param  {*}        value
     * @param  {Schema}   schema
     * @param  {Object}   [options]
     * @param  {Function} callback
     */
    validate(value, schema, options, callback) {
        schema._optimize();

        if (typeof options === 'function') {
            callback = options;
            options = defaultOptions;
        } else {
            options = Object.assign(clone(defaultOptions), options)
        }

        if (options.convert) {
            value = clone(value);
        }

        const run = (rules, converted = false) => {
            const rule = rules[0];
            if (!rule) return callback(null, value);

            rule.validate({
                value,
                validate: options._path,
            }, (err) => {
                if (!err) return run(rules.slice(1));

                if (options.convert) {
                    const converted = rule.coerce(value);
                    if (converted) {
                        value = converted;
                        return run(rules, true);
                    }
                }

                return callback(err, value);
            });
        };

        run(schema._rules);
    }
}
