import { RuleParams } from '../RuleParams';
import { IRuleValidationParams } from '../types/rule';
import { SyncRule } from '../types/syncRule';

export class FunctionValidator extends SyncRule {

    public validateSync(params: IRuleValidationParams<any>) {
        return typeof params.value === 'function';
    }

    public static ruleName() {
        return 'func';
    }
}

export abstract class ArityBase extends SyncRule {
    protected val: number;
    public compile(params: RuleParams) {
        this.val = params.args[0];
    }
}

export class Arity extends ArityBase {

    public validateSync(params: IRuleValidationParams<Function>) {
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

export class MinArity extends ArityBase {

    public compile(params: RuleParams) {
        this.val = params.args[0];
    }

    public validateSync(params: IRuleValidationParams<Function>) {
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

export class MaxArity extends ArityBase {

    public validateSync(params: IRuleValidationParams<Function>) {
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
