import SyncRule from '../types/syncRule';

/**
 * Intentionally does not coerce strings like joi.
 */
class BooleanValidator extends SyncRule {

    coerce(value) {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
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
