export const async = {
    /**
     * Attempts to run all the functions, which take callbacks. Runs the
     * callback function when they all resolve or upon the first error.
     * @param  {[]Function} fns
     * @param  {Function} callback
     */
    all(fns, callback) {
        let todo = fns.length;
        const cb = (err) => {
            if (err) {
                todo = -1;
                return callback(err);
            }

            todo--;
            if (todo === 0) {
                return callback();
            }

            return undefined;
        };

        for (let i = 0; i < fns.length; i++) {
            fns[i](cb);
        }
    },
    /**
     * Attempts to run all funcs and callbacks positively on the first success.
     * @param  {Function[]} fns
     * @param  {Function} callback
     */
    some(fns, callback) {
        let todo = fns.length;
        let firstFailed;
        const cb = (err, res) => {
            if (!err) {
                todo = 0;
                return callback(null, res);
            }
            if (!firstFailed) {
                firstFailed = err;
            }
            todo--;
            if (todo === 0) {
                return callback(firstFailed);
            }
            return null;
        };

        for (let i = 0; i < fns.length && todo > 0; i++) {
            fns[i](cb);
        }
    },
};

/**
 * Similar to Object.assign, but stricter and about 4x faster.
 * @param  {Object} ...objects
 * @return {Object}
 */
export function assign(target) {
    for (let i = 1; i < arguments.length; i++) {
        const arg = arguments[i];
        if (!arg) continue;

        for (let k = 0, keys = Object.keys(arg); k < keys.length; k++) {
            target[keys[k]] = arg[keys[k]];
        }
    }

    return target;
}

/**
 * Simple, shallow clone of a plain object.
 * @param  {Object} obj
 * @return {Object}
 */
export function clone(obj) {
    return assign({}, obj);
}

/**
 * Escapes all RegEx control characters
 * @param  {String} obj
 * @return {String}
 */
export function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

