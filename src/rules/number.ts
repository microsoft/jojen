import { IRuleValidationParams } from '../types/rule';
import { SyncRule } from '../types/syncRule';
import { RuleParams } from '../RuleParams';

export abstract class SingleArgumentBase extends SyncRule {
    protected val: number;

    public compile(params: RuleParams) {
        this.val = params.args[0];
    }
}

export class NumberValidator extends SyncRule {

    public coerce(value: any) {
        if (typeof value !== 'string') {
            return undefined;
        }

        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }

    public validateSync(params: IRuleValidationParams<any>) {
        return typeof params.value === 'number' &&
        !Number.isNaN(params.value) &&
        Number.isFinite(params.value);
    }

    public static ruleName() {
        return 'number';
    }
}

export class Integer extends SyncRule {

    public validateSync(params: IRuleValidationParams<number>) {
        return Number.isInteger(params.value);
    }

    public static ruleName() {
        return 'number.integer';
    }
}

export class Min extends SingleArgumentBase {


    public validateSync(params: IRuleValidationParams<number>) {
        return params.value >= this.val || {
            min: this.val,
        };
    }

    public static ruleName() {
        return 'number.min';
    }
}

export class Max extends SingleArgumentBase {

    public validateSync(params: IRuleValidationParams<number>) {
        return params.value <= this.val || {
            max: this.val,
        };
    }

    public static ruleName() {
        return 'number.max';
    }
}

export class Greater extends SingleArgumentBase {

    public validateSync(params: IRuleValidationParams<number>) {
        return params.value > this.val || {
            greater: this.val,
        };
    }

    public static ruleName() {
        return 'number.greater';
    }
}

export class Less extends SingleArgumentBase {

    public validateSync(params: IRuleValidationParams<number>) {
        return params.value < this.val || {
            less: this.val,
        };
    }

    public static ruleName() {
        return 'number.less';
    }
}

export class Negative extends SyncRule {

    public validateSync(params: IRuleValidationParams<number>) {
        return params.value < 0;
    }

    public static ruleName() {
        return 'number.negative';
    }
}

export class Positive extends SyncRule {

    public validateSync(params: IRuleValidationParams<number>) {
        return params.value > 0;
    }

    public static ruleName() {
        return 'number.positive';
    }
}

export class Multiple extends SingleArgumentBase {

    public validateSync(params: IRuleValidationParams<number>) {
        return params.value % this.val === 0 || {
            multiple: this.val,
        };
    }

    public static ruleName() {
        return 'number.multiple';
    }
}

const precisionRegEx = /^-?\d+(\.\d+)?$/;

export class Precision extends SingleArgumentBase {

    public coerce(value: number) {
        return parseFloat(value.toFixed(this.val));
    }

    public validateSync(params: IRuleValidationParams<number>) {
        const match = params.value.toString().match(precisionRegEx);
        if (!match || !match[1]) {
            return true;
        }

        const length = match[1].length - 1;
        return length <= this.val || {
            precision: length,
            limit: this.val,
        };
    }

    public static ruleName() {
        return 'number.precision';
    }
}
