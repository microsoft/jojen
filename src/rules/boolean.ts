import SyncRule from '../types/syncRule';

/**
 * Intentionally does not coerce strings like joi.
 */
class BooleanValidator extends SyncRule {

    public coerce (value: any): boolean {
        if (value === 'true' || Number(value) === 1) {
            return true;
        }
        if (value === 'false' || Number(value) === 0) {
            return false;
        }
        return undefined;
    }

    public validateSync(params) {
        return typeof params.value === 'boolean';
    }

    public static ruleName () {
        return 'boolean';
    }
}

module.exports = [BooleanValidator];
