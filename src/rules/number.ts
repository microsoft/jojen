import SyncRule from '../types/syncRule';

class SingleArgumentBase extends SyncRule {
    protected val: number;

    public compile(params) {
        this.val = params.args[0];
    }
}

class NumberValidator extends SyncRule {

    public coerce(value) {
        if (typeof value !== 'string') {
            return undefined;
        }

        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }

    public validateSync(params) {
        return typeof params.value === 'number' &&
        !Number.isNaN(params.value) &&
        Number.isFinite(params.value);
    }

    public static ruleName() {
        return 'number';
    }
}

class Integer extends SyncRule {

    public validateSync(params) {
        return Number.isInteger(params.value);
    }

    public static ruleName() {
        return 'number.integer';
    }
}

class Min extends SingleArgumentBase {


    public validateSync(params) {
        return params.value >= this.val || {
            min: this.val,
        };
    }

    public static ruleName() {
        return 'number.min';
    }
}

class Max extends SingleArgumentBase {

    public validateSync(params) {
        return params.value <= this.val || {
            max: this.val,
        };
    }

    public static ruleName() {
        return 'number.max';
    }
}

class Greater extends SingleArgumentBase {

    public validateSync(params) {
        return params.value > this.val || {
            greater: this.val,
        };
    }

    public static ruleName() {
        return 'number.greater';
    }
}

class Less extends SingleArgumentBase {

    public validateSync(params) {
        return params.value < this.val || {
            less: this.val,
        };
    }

    public static ruleName() {
        return 'number.less';
    }
}

class Negative extends SyncRule {

    public validateSync(params) {
        return params.value < 0;
    }

    public static ruleName() {
        return 'number.negative';
    }
}

class Positive extends SyncRule {

    public validateSync(params) {
        return params.value > 0;
    }

    public static ruleName() {
        return 'number.positive';
    }
}

class Multiple extends SingleArgumentBase {

    public validateSync(params) {
        return params.value % this.val === 0 || {
            multiple: this.val,
        };
    }

    public static ruleName() {
        return 'number.multiple';
    }
}

const precisionRegEx = /^-?\d+(\.\d+)?$/;

class Precision extends SingleArgumentBase {

    public coerce(value) {
        return parseFloat(value.toFixed(this.val));
    }

    public validateSync(params) {
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

module.exports = [
    NumberValidator,
    Integer,
    Min,
    Max,
    Greater,
    Less,
    Negative,
    Positive,
    Multiple,
    Precision,
];
