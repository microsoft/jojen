import Ruleset from './ruleset';
import { Schema } from './schema';
import { Rule } from './types/rule';

import Any from './rules/any';

import { assign } from './util';
import defaultRules from './rules';

const defaultOptions = Object.freeze({
    captureStack: false,
    convert: true,
    _path: [],
    // todo(connor4312): fill out the rest of the Joi options
});

export interface IValidationOptions {
    convert: boolean;
    captureStack: boolean;
}

/**
 * The validator is the main entry point for building validation schemas.
 * You can .add() Rules to it, and also start building schemas (e.g.
 * Jo.required()) directly on the validator instance.
 */
export default class Validator {
    private ruleset = new Ruleset()
    private schema: Schema = null;
    private lang: Language = null;
    constructor() {
        this.add(defaultRules);
    }

    /**
     * Adds a new Rule or array of Rules to the validator.
     * @param {Rule|[]Rule} rules
     * @return Validator
     */
    public add(rules: Rule|Rule[]): this {
        if (!Array.isArray(rules)) {
            this.add([rules]);
            return this;
        }

        rules.forEach((rule) => {
            this.ruleset.addRule(rule.ruleName().split('.'), rule);
        });

        this.schema = new Schema(this.ruleset).optional();
        this.ruleset.buildChain(this, (method, child, ...args) =>
            this.schema[method](...args)
        );

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
    public load(language) {
        if (typeof language === 'string') {
            this.lang = require(`./lang/${language}`);
        } else {
            this.lang = language;
        }

        return this;
    }

    /**
     * Validates the give value against the schema.
     */
    public validate(value: any, schema: Schema, options: IValidationOptions, callback: (err: Error, val?: any) => void) {
        if (typeof options === 'function') {
            callback = options;
            options = defaultOptions;
        } else {
            options = assign({}, defaultOptions, options);
        }

        const run = (v: any, rules: Rule[], triedToConvert = false) => {
            const rule = rules[0];
            if (!rule) {
                callback(null, v);
                return;
            }

            return rule.validate(
                {
                    options,
                    value: v,
                    validator: this,
                    path: options._path,
                },
                (err, res) => {
                    if (err) {
                        if (options.convert && !triedToConvert) {
                            const converted = rule.coerce(v);
                            if (converted !== undefined) {
                                run(converted, rules, true);
                                return;
                            }
                        }

                        if (options.captureStack) {
                            err.addStackTrace();
                        }

                        err.attach(this.lang);
                        callback(err, v);
                        return;
                    }

                    if (res && res.abort) {
                        callback(null, v);
                        return;
                    }

                    run(v, rules.slice(1));
                }
            );
        };

        const rules = schema.getRules();

        // TODO: Refactor this to use *option* rules. Terrible hack.
        if (rules[0] instanceof Any[8]) {
            if (value === undefined) {
                callback(null, rules[0]._default);
                return;
            }
            rules.shift();
        }

        run(value, rules);
    }

    /**
     * Validates the give value against the schema synchronously.
     * @return {{value: *, error: !ValidationError}}
     */
    public validateSync(value: any, schema: Schema, options?: IValidationOptions) {
        let done: boolean;
        let error: Error;
        let retVal: any;
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
     */
    public assert(value: any, schema: Schema, message: string | Error): any {
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
