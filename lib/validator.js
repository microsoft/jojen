import Ruleset from './ruleset';
import Schema from './schema';

import { assign } from './util';
import defaultRules from './rules';

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
        this._schema = null;
        this._lang = null;
        this.add(defaultRules);
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

        this._schema = new Schema(this._ruleset).optional();
        this._ruleset.buildChain(this, (method, child, args) =>
            this._schema[method].apply(this._schema, args));

        return this;
    }

    /**
     * Attempts to load the language. The language can be:
     *  - an hashmap of validators to message functions, which are invoked
     *    with a ValidationLanguageOptions object.
     *  - a string to load a built-in rule, like 'en'. Note that this will
     *    NOT work with browserify, you must call
     *    Jo.load(require('jojen/dist/lang/en'))
     *
     * @param  {Object|String} language
     * @return {Validator}
     */
    load(language) {
        if (typeof language === 'string') {
            this._lang = require(`./lang/${language}`);
        } else {
            this._lang = language;
        }

        return this;
    }

    /**
     * Validates the give value against the schema.
     * @param  {*}        value
     * @param  {Schema}   schema
     * @param  {Object}   [options]
     * @param  {Function} callback
     */
    validate(value, schema, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = defaultOptions;
        } else {
            options = assign({}, defaultOptions, options);
        }

        const run = (v, rules, triedToConvert = false) => {
            const rule = rules[0];
            if (!rule) return callback(null, v);

            return rule.validate({
                options,
                value: v,
                validator: this,
                path: options._path,
            }, (err, res) => {
                if (err) {
                    if (options.convert && !triedToConvert) {
                        const converted = rule.coerce(v);
                        if (converted !== undefined) {
                            return run(converted, rules, true);
                        }
                    }

                    err.attach(this._lang);
                    return callback(err, v);
                }

                if (res && res.abort) {
                    return callback(null, v);
                }

                return run(v, rules.slice(1));
            });
        };

        run(value, schema.getRules());
    }

    /**
     * Validates the give value against the schema synchronously.
     * @param  {*}        value
     * @param  {Schema}   schema
     * @param  {Object}   [options]
     * @return {{value: *, error: !ValidationError}}
     */
    validateSync(value, schema, options) {
        let done;
        let error;
        let retVal;
        this.validate(value, schema, options, (err, val) => {
            done = true;
            error = err;
            retVal = val;
        });
        if (!done) {
            throw new Error('Cannot validate asynchronous rules synchronously!');
        }
        return {
            error,
            value: retVal,
        };
    }


    /**
     * Validates the give value against the schema.
     * @param  {*}        value
     * @param  {Schema}   schema
     * @param  {String|Error} message Prefixes the original message.
     * Or replaces it if an error object.
     * @return {*} The validated after it passed validation.
     */
    assert(value, schema, message) {
        const ret = this.validateSync(value, schema);
        const error = ret.error;
        if (!error) {
            return ret.value;
        }

        if (typeof message === 'string') {
            error.message = `${message} ${error.message}`;
            throw error;
        } else if (message) {
            throw message;
        } else {
            throw error;
        }
    }
}
