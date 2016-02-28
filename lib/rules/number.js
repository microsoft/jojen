import SyncRule from '../types/syncRule';

class NumberValidator extends SyncRule {

    validateSync(params) {
        return typeof params.value === 'number' && !Number.isNaN(params.value);
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

    validate(params) {
        return params.value >= this._val || {
            value: params.value,
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

    validate(params) {
        return params.value <= this._val || {
            value: params.value,
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
            value: params.value,
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
            value: params.value,
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

    validate(params) {
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

    validate(params) {
        return params.value % this._val === 0 || {
            value: params.value,
            multiple: this._val,
        };
    }

    static ruleName() {
        return 'number.multiple';
    }
}

class Precision extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validate(params) {
        const fracLength = (Math.abs(params.value % 1)).toString().length - 2;
        return fracLength <= this._value || {
            precision: fracLength,
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
