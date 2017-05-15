import * as deepEqual from 'deep-equal';

import { RuleParams } from '../RuleParams';
import { Schema } from '../Schema';
import {
    IRuleValidationParams,
    NonOperatingRule,
    Rule,
} from '../types/Rule';
import { SingeValRule, SyncRule } from '../types/SyncRule';
import { async, clone, get } from '../util';

class ArrayValidator extends SyncRule {
    public allowSingle = false;
    public allowSparse = false;

    public coerce(value: any) {
        if (this.allowSingle && !Array.isArray(value)) {
            return [value];
        }

        return undefined;
    }

    public validateSync(params: IRuleValidationParams<any, void>) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be an array.`;
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be an array.`;
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be an array.`;
    }
}

export class Items extends Rule {
    private schema: Schema;
    public compile(params: RuleParams) {
        this.schema = params.args[0];
    }

    public validate(params: IRuleValidationParams<any[], void>, callback: (error?: Error, data?: any) => void) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be an array.`;
    }
}

export class Ordered extends Rule {
    private schemas: Schema[];
    public compile(params: RuleParams) {
        this.schemas = params.args;
    }

    public validate(params: IRuleValidationParams<any[], void>, callback: (error?: Error, data?: any) => void) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be ordered.`;
    }
}

export class MinItems extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<any[], void>) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must have at least ${this.val} elements.`;
    }
}

export class MaxItems extends SingeValRule<number> {
    public validateSync(params: IRuleValidationParams<any[], void>) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" may not have more than ${this.val} elements.`;
    }
}

export class LengthExact extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<any[], void>) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must have exactly ${this.val} elements.`;
    }
}

export class Unique extends SyncRule {
    private key: string;
    private compFn: (a: any, b: any) => boolean;
    public compile(params: RuleParams) {
        const comp = params.args[0];
        if (typeof comp === 'string') {
            this.key = comp;
        } else if (comp instanceof Function) {
            this.compFn = comp;
        }
    }

    public validateSync(params: IRuleValidationParams<any[], void>): boolean {
        const v = params.value;
        const l = v.length;
        const compare = this.compFn || deepEqual;
        for (let i = 0; i < l; i++) {
            for (let k = i + 1; k < l; k++) {
                let isEqual = false;
                if (this.key) {
                    isEqual = deepEqual(get(v[i], this.key), get(v[k], this.key));
                } else {
                    isEqual = compare(v[i], v[k]);
                }
                if (isEqual) {
                    return false;
                }
            }
        }

        return true;
    }

    public static ruleName() {
        return 'array.unique';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be unique but has duplicate.`;
    }
}
