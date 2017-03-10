import * as deepEqual from 'deep-equal';

import { RuleParams } from '../RuleParams';
import { Schema } from '../Schema';
import {
    IRuleValidationParams,
    NonOperatingRule,
    Rule,
} from '../types/rule';
import { SingeValRule, SyncRule } from '../types/syncRule';
import { async, clone } from '../util';

class ArrayValidator extends SyncRule {
    public allowSingle = false;
    public allowSparse = false;

    public coerce(value: any) {
        if (this.allowSingle && !Array.isArray(value)) {
            return [value];
        }

        return undefined;
    }

    public validateSync(params: IRuleValidationParams<any>) {
        if (!Array.isArray(params.value)) {
            return false;
        }

        if (!this.allowSparse) {
            for (let i = 0; i < params.value.length; i++) {
                if (params.value[i] === undefined) {
                    return false;
                }
            }
        }

        return true;
    }

    public static ruleName() {
        return 'array';
    }
}

export class Sparse extends NonOperatingRule {
    public compile(params: RuleParams) {
        const allow = params.args[0] === undefined ? true : params.args[0];
        params.invokeLast(ArrayValidator, r => { r.allowSparse = allow; });
    }

    public operates() {
        return false;
    }

    public static ruleName() {
        return 'array.sparse';
    }
}

export class Single extends NonOperatingRule {
    public compile(params: RuleParams) {
        const allow = params.args[0] === undefined ? true : params.args[0];
        params.invokeLast(ArrayValidator, r => { r.allowSingle = allow; });
    }

    public operates() {
        return false;
    }

    public static ruleName() {
        return 'array.single';
    }
}

export class Items extends Rule {
    private schema: Schema;
    public compile(params: RuleParams) {
        this.schema = params.args[0];
    }

    public validate(params: IRuleValidationParams<any[]>, callback: (error?: Error, data?: any) => void) {
        return async.map(
            params.value, (item, index) => {
                const options = clone(params.options);
                options.path = options.path.concat(`[${index}]`);

                return (done: (error?: Error, data?: any) => void) => {
                    params.validator.validate(item, this.schema, options, done);
                };
            },
            callback,
        );
    }

    public static ruleName() {
        return 'array.items';
    }
}

export class Ordered extends Rule {
    private schemas: Schema[];
    public compile(params: RuleParams) {
        this.schemas = params.args;
    }

    public validate(params: IRuleValidationParams<any[]>, callback: (error?: Error, data?: any) => void) {
        const length = this.schemas.length;
        const expected = params.value.length;
        if (length !== expected) {
            return callback(this.error(params, { length, expected }));
        }

        return async.map(
            this.schemas, (schema, index) => {
                const options = clone(params.options);
                options.path = options.path.concat(`[${index}]`);

                return (done: (error?: Error) => void) => params.validator.validate(params.value[index], schema, options, done);
            },
            callback,
        );
    }

    public static ruleName() {
        return 'array.ordered';
    }
}

export class MinItems extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<any[]>) {
        const length = params.value.length;
        const min = this.val;
        if (length < min) {
            return  { length, min };
        }

        return true;
    }

    public static ruleName() {
        return 'array.min';
    }
}

export class MaxItems extends SingeValRule<number> {
    public validateSync(params: IRuleValidationParams<any[]>) {
        const length = params.value.length;
        const max = this.val;
        if (length > max) {
            return { length, max };
        }

        return true;
    }

    public static ruleName() {
        return 'array.max';
    }
}

export class LengthExact extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<any[]>) {
        const length = params.value.length;
        const expected = this.val;
        if (length !== expected) {
            return { length, expected };
        }

        return true;
    }

    public static ruleName() {
        return 'array.length';
    }
}

export class Unique extends SyncRule {
    public validateSync(params: IRuleValidationParams<any[]>) {
        const v = params.value;
        const l = v.length;
        for (let i = 0; i < l; i++) {
            for (let k = i + 1; k < l; k++) {
                if (deepEqual(v[i], v[k])) {
                    return {
                        violator: {
                            index: k,
                            value: v[k],
                        },
                    };
                }
            }
        }

        return true;
    }

    public static ruleName() {
        return 'array.unique';
    }
}
