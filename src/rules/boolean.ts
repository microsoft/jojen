import { IRuleValidationParams } from '../types/Rule';
import { SyncRule } from '../types/SyncRule';

/**
 * Intentionally does not coerce strings like joi.
 */
export class BooleanValidator extends SyncRule {

    public coerce(value: any): boolean {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return undefined;
    }

    public validateSync(params: IRuleValidationParams<any, void>) {
        return typeof params.value === 'boolean';
    }

    public static ruleName () {
        return 'boolean';
    }

    public getErrorMessage (params: IRuleValidationParams<any, void>) {
        return `"${params.key}" must be a boolean.`;
    }
}
