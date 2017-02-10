import { IRuleValidationParams } from '../types/rule';
import { SyncRule } from '../types/syncRule';

/**
 * Intentionally does not coerce strings like joi.
 */
export class BooleanValidator extends SyncRule {

    public coerce (value: any): boolean {
        if (value === 'true' || Number(value) === 1) {
            return true;
        }
        if (value === 'false' || Number(value) === 0) {
            return false;
        }
        return undefined;
    }

    public validateSync(params: IRuleValidationParams<any>) {
        return typeof params.value === 'boolean';
    }

    public static ruleName () {
        return 'boolean';
    }
}
