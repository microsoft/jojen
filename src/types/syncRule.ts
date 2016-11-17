import { Rule } from './rule';

/**
 * Helper rule that handles callback calling for synchronous validation rules.
 */
export abstract class SyncRule extends Rule {

    public validate(params, callback) {
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
    public abstract validateSync(params): boolean | Object;
}
