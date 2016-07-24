import SyncRule from '../types/syncRule';

class NumberValidator extends SyncRule {

    coerce(value) {
        if (typeof value !== 'string') {
            return undefined;
        }

        const parsed = Number(String(value));
        return Number.isNaN(parsed) ? undefined : parsed;
    }

    validateSync(params) {
        return typeof params.value === 'number' &&
        !Number.isNaN(params.value) &&
        Number.isFinite(params.value);
    }

    static ruleName() {
        return 'number';
    }
}

class Integer extends SyncRule {

    validateSync(params) {
        return Number.isInteger(params.value);
    }

    static ruleName() {
        return 'number.integer';
    }
}

class Min extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        return params.value >= this._val || {
            min: this._val,
        };
    }

    static ruleName() {
        return 'number.min';
    }
}

class Max extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        return params.value <= this._val || {
            max: this._val,
        };
    }

    static ruleName() {
        return 'number.max';
    }
}

class Greater extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        return params.value > this._val || {
            greater: this._val,
        };
    }

    static ruleName() {
        return 'number.greater';
    }
}

class Less extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        return params.value < this._val || {
            less: this._val,
        };
    }

    static ruleName() {
        return 'number.less';
    }
}

class Negative extends SyncRule {

    validateSync(params) {
        return params.value < 0;
    }

    static ruleName() {
        return 'number.negative';
    }
}

class Positive extends SyncRule {

    validateSync(params) {
        return params.value > 0;
    }

    static ruleName() {
        return 'number.positive';
    }
}

class Multiple extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        return params.value % this._val === 0 || {
            multiple: this._val,
        };
    }

    static ruleName() {
        return 'number.multiple';
    }
}

const precisionRegEx = /^-?\d+(\.\d+)?$/;

class Precision extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    coerce(value) {
        return parseFloat(value.toFixed(this._val));
    }

    validateSync(params) {
        const match = params.value.toString().match(precisionRegEx);
        if (!match || !match[1]) {
            return true;
        }

        const length = match[1].length - 1;
        return length <= this._val || {
            precision: length,
            limit: this._val,
        };
    }

    static ruleName() {
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
