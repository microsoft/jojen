export const async = {
    /**
     * Attempts to run all the functions, which take callbacks. Runs the
     * callback function when they all resolve or upon the first error.
     * @param  {[]Function} fns
     * @param  {Function} callback
     * @return {Function[]} fns
     */
    all(fns, callback) {
        if (fns.length === 0) {
            return callback();
        }
        let todo = fns.length;
        const cb = (err) => {
            if (todo === -1) {
                return undefined;
            }
            if (err && todo !== -1) {
                todo = -1;
                return callback(err);
            }

            todo--;
            if (todo === 0) {
                return callback();
            }

            return undefined;
        };

        for (let i = 0; i < fns.length && todo > 0; i++) {
            fns[i](cb);
        }
        return fns;
    },

    /**
     * Attempts to run all funcs and callbacks positively on the first success.
     * @param  {Function[]} fns
     * @param  {Function} callback
     * @return {Function[]} fns
     */
    some(fns, callback) {
        if (fns.length === 0) {
            return callback(new Error('Empty array'));
        }
        let todo = fns.length;
        let firstFailed;
        const cb = (err, res) => {
            if (todo === -1) {
                return undefined;
            }
            if (!err) {
                todo = -1;
                return callback(null, res);
            }
            if (!firstFailed) {
                firstFailed = err;
            }
            todo--;
            if (todo === 0) {
                return callback(firstFailed);
            }
            return undefined;
        };

        // most operations are sync, this will stop some from being run.
        for (let i = 0; i < fns.length && todo > 0; i++) {
            fns[i](cb);
        }
        return fns;
    },

    /**
     * Map an array to a function in parallel.
     * @param  {Array} collection
     * @param  {Function} iteratee
     * @param  {Function} callback
     * @return {Function[]} fns
     */
    map(collection, iteratee, callback) {
        return async.all(collection.map((item, index) =>
            iteratee(item, index)
        ), callback);
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
 * Returns a subset of attributes from the object.
 * @param  {Object} obj
 * @param  {[]String} attrs
 * @return {Object}
 */
export function pick(obj, attrs) {
    const out = {};
    for (let i = 0; i < attrs.length; i++) {
        out[attrs[i]] = obj[attrs[i]];
    }

    return out;
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
