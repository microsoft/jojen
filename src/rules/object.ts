import { RuleParams } from '../RuleParams';
import { Schema } from '../Schema';
import {
    IRuleValidationParams,
    NonOperatingRule,
    Rule,
} from '../types/rule';
import {
    SyncRule,
} from '../types/syncRule';
import {
    assign,
    async,
    clone,
} from '../util';

export class ObjectValidator extends SyncRule {
    public validateSync(params: IRuleValidationParams<{}>) {
        return params.value && typeof params.value === 'object';
    }

    public static ruleName() {
        return 'object';
    }
}

export class Keys extends Rule {
    private obj: { [key: string]: any };
    private keys: string[];
    public allowUnknown: boolean;
    public compile(params: RuleParams) {
        const found = params.invokeFirst(<typeof Keys>this.constructor, rule => {
            rule.obj = assign({}, rule.obj, params.args[0]);
            rule.keys = rule.keys.concat(Object.keys(params.args[0]));
        });
        if (found) {
            return;
        }
        this.obj = params.args[0];
        this.keys = Object.keys(params.args[0]);
        // If an Unknown rule is added later, it'll set this to true
        this.allowUnknown = false;
    }

    public operates() {
        return !!this.keys;
    }

    /**
     * Checks to see if the value contains unknown keys. Returns true and
     * calls back with an error if so.
     */
    private validateUnknown(params: IRuleValidationParams<{}>, callback: (error: Error) => void): boolean {
        const keys = Object.keys(params.value);
        for (let i = 0; i < keys.length; i++) {
            if (this.keys.indexOf(keys[i]) === -1) {
                callback(this.error(params, { extra: keys[i], rule: 'object.unknown' }));
                return true;
            }
        }

        return false;
    }

    public validate(params: IRuleValidationParams<{ [key: string]: any }>, callback: (error?: Error) => void) {
        const value = params.value;
        if (value === undefined || value === null) {
            return callback(this.error(params));
        }

        if (!this.allowUnknown && this.validateUnknown(params, callback)) {
            return undefined;
        }

        const todo = this.keys.map((key) => {
            const options = clone(params.options);
            options.path = options.path.concat(key);

            return (done: (error?: Error) => void) => {
                params.validator.validate(
                    value[key],
                    this.obj[key],
                    options,
                    (err: Error, converted: boolean) => {
                        if (err) {
                            return done(err);
                        }

                        if (options.convert && converted !== undefined) {
                            value[key] = converted;
                        }

                        return done();
                    },
                );
            };
        });

        return async.all(todo, callback);
    }

    public static ruleName() {
        return 'object.keys';
    }
}

export class Pattern extends Rule {
    private keyRegex: RegExp;
    private valueSchema: Schema;
    public compile(params: RuleParams) {
        this.keyRegex = new RegExp(params.args[0]);
        this.valueSchema = params.args[1];
    }

    public validate(params: IRuleValidationParams<{ [key: string]: any}>, callback: (error?: Error) => void) {
        const value = params.value;
        if (value === undefined || value === null) {
            return callback(this.error(params));
        }

        const todo = Object.keys(value).map((key) => {
            const options = clone(params.options);
            options.path = options.path.concat(key);

            return (done: (error?: Error) => void) => {
                if (!this.keyRegex.test(key)) {
                    done(this.error(params, { extra: key, rule: 'object.unknown' }));
                    return;
                }

                params.validator.validate(
                    value[key],
                    this.valueSchema,
                    options,
                    (err, converted) => {
                        if (err) {
                            return done(err);
                        }

                        if (options.convert && converted !== undefined) {
                            value[key] = converted;
                        }

                        return done();
                    });
            };
        });

        return async.all(todo, callback);
    }

    public static ruleName() {
        return 'object.pattern';
    }
}

export class Unknown extends NonOperatingRule {
    public compile(params: RuleParams): void {
        const allow = params.args[0] === undefined ? true : params.args[0];
        params.invokeLast(Keys, r => { r.allowUnknown = allow; });
    }

    public operates(): boolean {
        return false;
    }

    public static ruleName() {
        return 'object.unknown';
    }
}
