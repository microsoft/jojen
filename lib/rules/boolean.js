import SyncRule from '../types/syncRule';

/**
 * Intentionally does not coerce strings like joi.
 */
class BooleanValidator extends SyncRule {

    validateSync(params) {
        return typeof params.value === 'boolean';
    }

    static ruleName() {
        return 'boolean';
    }
}

module.exports = [BooleanValidator];
