import SyncRule from '../types/syncRule';

/**
 * Intentionally does not coerce strings like joi.
 */
class BooleanValidator extends SyncRule {

    coerce(value) {
        if (value === 'true' || Number(value) === 1) {
            return true;
        }
        if (value === 'false' || Number(value) === 0) {
            return false;
        }
        return undefined;
    }

    validateSync(params) {
        return typeof params.value === 'boolean';
    }

    static ruleName() {
        return 'boolean';
    }
}

module.exports = [BooleanValidator];
