import Rule from './rule';

/**
 * Helper rule that handles callback calling for synchronous validation rules.
 */
export default class SyncRule extends Rule {
    /**
     * @override
     */
    validate(params, callback) {
        const res = this.validateSync(params);
        if (res === true) {
            callback();
        }
        if (res instanceof Object) {
            return callback(this.error(params, res));
        }
        return callback(this.error(params));
    }

    /**
     * Validates synchronously.
     * @return {Boolean|Object} If object, assume error and pass as metadata.
     * If boolean, true = success, false = error.
     */
    validateSync() {
        throw new Error('Not implemented');
    }
}
