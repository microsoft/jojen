import { RuleParams } from '../RuleParams';
import { IRuleValidationParams, Rule } from './Rule';

/**
 * Helper rule that handles callback calling for synchronous validation rules.
 */
export abstract class SyncRule extends Rule {

    public validate(params: IRuleValidationParams<any, void>, callback: (error?: Error) => void) {
        const res = this.validateSync(params);
        if (res === true) {
            return callback();
        }
        if (res instanceof Object) {
            return callback(this.error(params, res));
        }
        return callback(this.error(params));
    }

    /**
     * Validates synchronously.
     * If boolean, true = success, false = error.
     */
    public abstract validateSync(params: IRuleValidationParams<any, void>): boolean | {
        rule?: string;
        abort?: boolean;
    };
}

export abstract class SingeValRule<T> extends SyncRule {
    protected val: T;
    public compile (params: RuleParams) {
        this.val = params.args[0];
    }
}
