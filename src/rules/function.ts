import SyncRule from '../types/syncRule';

class FunctionValidator extends SyncRule {

    public validateSync(params) {
        return typeof params.value === 'function';
    }

    public static ruleName() {
        return 'func';
    }
}

class ArityBase extends SyncRule {
    protected val: number;
    public compile(params) {
        this.val = params.args[0];
    }
}

class Arity extends ArityBase {

    public validateSync(params) {
        const arity = params.value.length;
        return arity === this.val || {
            arity,
            expected: this.val,
        };
    }

    public static ruleName() {
        return 'func.arity';
    }
}

class MinArity extends ArityBase {

    public compile(params) {
        this.val = params.args[0];
    }

    public validateSync(params) {
        const arity = params.value.length;
        return arity >= this.val || {
            arity,
            min: this.val,
        };
    }

    public static ruleName() {
        return 'func.minArity';
    }
}

class MaxArity extends ArityBase {

    public validateSync(params) {
        const arity = params.value.length;
        return arity <= this.val || {
            arity,
            max: this.val,
        };
    }

    public static ruleName() {
        return 'func.maxArity';
    }
}

module.exports = [FunctionValidator, Arity, MinArity, MaxArity];
