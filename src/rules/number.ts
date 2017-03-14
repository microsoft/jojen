import { IRuleValidationParams } from '../types/Rule';
import { SingeValRule, SyncRule } from '../types/SyncRule';

export class NumberValidator extends SyncRule {

    public coerce(value: any) {
        if (typeof value !== 'string') {
            return undefined;
        }

        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }

    public validateSync(params: IRuleValidationParams<any, void>) {
        return typeof params.value === 'number' &&
        !Number.isNaN(params.value) &&
        Number.isFinite(params.value);
    }

    public static ruleName() {
        return 'number';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be a number.`;
    }
}

export class Integer extends SyncRule {

    public validateSync(params: IRuleValidationParams<number, void>) {
        return Number.isInteger(params.value);
    }

    public static ruleName() {
        return 'number.integer';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be an integer.`;
    }
}

export class Min extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<number, void>) {
        return params.value >= this.val || {
            min: this.val,
        };
    }

    public static ruleName() {
        return 'number.min';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be at least ${this.val}.`;
    }
}

export class Max extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<number, void>) {
        return params.value <= this.val || {
            max: this.val,
        };
    }

    public static ruleName() {
        return 'number.max';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be at most ${this.val}.`;
    }
}

export class Greater extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<number, void>) {
        return params.value > this.val || {
            greater: this.val,
        };
    }

    public static ruleName() {
        return 'number.greater';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be greater than ${this.val}.`;
    }
}

export class Less extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<number, void>) {
        return params.value < this.val || {
            less: this.val,
        };
    }

    public static ruleName() {
        return 'number.less';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be less than ${this.val}.`;
    }
}

export class Negative extends SyncRule {

    public validateSync(params: IRuleValidationParams<number, void>) {
        return params.value < 0;
    }

    public static ruleName() {
        return 'number.negative';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be negative.`;
    }
}

export class Positive extends SyncRule {

    public validateSync(params: IRuleValidationParams<number, void>) {
        return params.value > 0;
    }

    public static ruleName() {
        return 'number.positive';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be positive.`;
    }
}

export class Multiple extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<number, void>) {
        return params.value % this.val === 0 || {
            multiple: this.val,
        };
    }

    public static ruleName() {
        return 'number.multiple';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be multiple of ${this.val}`;
    }
}

const precisionRegEx = /^-?\d+(\.\d+)?$/;

export class Precision extends SingeValRule<number> {

    public coerce(value: number) {
        return parseFloat(value.toFixed(this.val));
    }

    public validateSync(params: IRuleValidationParams<number, void>) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must have a max precision of ${this.val}.`;
    }
}
