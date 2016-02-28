import SyncRule from '../types/syncRule';

class FunctionValidator extends SyncRule {

    validateSync(params) {
        return typeof params.value === 'function';
    }

    static ruleName() {
        return 'func';
    }
}

class Arity extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        const arity = params.value.length;
        return arity === this._val || {
            arity,
            expected: this._val,
        };
    }

    static ruleName() {
        return 'func.arity';
    }
}

class MinArity extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        const arity = params.value.length;
        return arity >= this._val || {
            arity,
            expected: this._val,
        };
    }

    static ruleName() {
        return 'func.minArity';
    }
}

class MaxArity extends SyncRule {

    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        const arity = params.value.length;
        return arity <= this._val || {
            arity,
            expected: this._val,
        };
    }

    static ruleName() {
        return 'func.maxArity';
    }
}

module.exports = [FunctionValidator, Arity, MinArity, MaxArity];
