import { IAnySchema } from './compiledSchemas';
import { ValidationError } from './errors';
import * as allRules from './rules';
import { Default } from './rules/any';
import { Ruleset } from './Ruleset';
import { Schema } from './Schema';
import { IRuleCtor, Rule } from './types/Rule';
import { assign } from './util';

const defaultOptions = Object.freeze({
    captureStack: false,
    convert: true,
    _path: [],
    // todo(connor4312): fill out the rest of the Joi options
});

export interface IValidationOptions {
    convert: boolean;
    captureStack: boolean;
    path?: string[];
}

function values<T>(obj: T): T[keyof T][] {
    const keys = <(keyof T)[]>Object.keys(obj);
    const ret = [];
    for (let i = 0; i < keys.length; ++i) {
        ret.push(obj[keys[i]]);
    }
    return <any>ret;
}

const defaultRules: IRuleCtor<Rule>[] = values(allRules);

export interface IValidationResult<T> {
    error?: ValidationError;
    value: T;
}

/**
 * The validator is the main entry point for building validation schemas.
 * You can .add() Rules to it, and also start building schemas (e.g.
 * Jo.required()) directly on the validator instance.
 */
export class Validator {
    private ruleset = new Ruleset();
    private schema: Schema;
    constructor() {
        this.add(defaultRules);
    }

    /**
     * Adds a new Rule or array of Rules to the validator.
     */
    public add(rules: IRuleCtor<Rule> | IRuleCtor<Rule>[]): this {
        if (!Array.isArray(rules)) {
            this.add([rules]);
            return this;
        }

        rules.forEach(rule => {
            this.ruleset.addRule(rule.ruleName().split('.'), rule);
        });

        const schema = <IAnySchema>new Schema(this.ruleset);
        this.schema = schema.optional();
        this.ruleset.buildChain(this, (method, _child, ...args) =>
            (<{ [rule: string]: (...args: any[]) => Schema }><any>this.schema)[method](...args),
        );

        return this;
    }

    /**
     * Validates the give value against the schema.
     */
    public validate(value: any, schema: Schema, options: IValidationOptions, callback: (err: ValidationError, val?: any) => void): void {
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
                    path: options.path,
                    meta: {},
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

                        callback(err, v);
                        return;
                    }

                    if (res && (<{ abort: boolean }>res).abort) {
                        callback(null, v);
                        return;
                    }

                    run(v, rules.slice(1));
                },
            );
        };

        const rules = schema.getRules();

        // TODO: Refactor this to use *option* rules. Terrible hack.
        const r = rules[0];
        if (r instanceof Default) {
            if (value === undefined) {
                callback(null, r.default);
                return;
            }
            rules.shift();
        }

        run(value, rules);
    }

    /**
     * Validates the give value against the schema synchronously.
     */
    public validateSync<T>(value: T, schema: Schema, options?: IValidationOptions): IValidationResult<T> {
        let done: boolean;
        let error: ValidationError;
        let retVal: T;
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
    public assert<T>(value: any, schema: Schema, message: string | Error): T {
        const ret = this.validateSync(value, schema);
        const error = ret.error;
        if (!error) {
            return ret.value;
        }

        if (typeof message === 'string') {
            error.message = `${message} ${error.message}`;
            throw error;
        }
        if (message) {
            throw message;
        }
        throw error;
    }
}
