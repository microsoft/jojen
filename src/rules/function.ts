import { RuleParams } from '../RuleParams';
import { IRuleValidationParams } from '../types/Rule';
import { SingeValRule, SyncRule } from '../types/SyncRule';

export class FunctionValidator extends SyncRule {

    public validateSync(params: IRuleValidationParams<any, void>) {
        return typeof params.value === 'function';
    }

    public static ruleName() {
        return 'func';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return  `"${params.key}" must be a function.`;
    }
}

export class Arity extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<Function, void>) {
        const arity = params.value.length;
        return arity === this.val || {
            arity,
            expected: this.val,
        };
    }

    public static ruleName() {
        return 'func.arity';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return  `"${params.key}" must have exactly ${this.val} arguments.`;
    }
}

export class MinArity extends SingeValRule<number> {

    public compile(params: RuleParams) {
        this.val = params.args[0];
    }

    public validateSync(params: IRuleValidationParams<Function, void>) {
        const arity = params.value.length;
        return arity >= this.val || {
            arity,
            min: this.val,
        };
    }

    public static ruleName() {
        return 'func.minArity';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return  `"${params.key}" must have at least ${this.val} arguments.`;
    }
}

export class MaxArity extends SingeValRule<number> {

    public validateSync(params: IRuleValidationParams<Function, void>) {
        const arity = params.value.length;
        return arity <= this.val || {
            arity,
            max: this.val,
        };
    }

    public static ruleName() {
        return 'func.maxArity';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return  `"${params.key}" must have at most ${this.val} arguments.`;
    }
}
