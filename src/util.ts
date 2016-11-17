export const async = {
    /**
     * Attempts to run all the functions, which take callbacks. Runs the
     * callback function when they all resolve or upon the first error.
     */
    all(fns: ((cb: (err?: Error) => void) => void)[], callback: (err?: Error) => void): void {
        if (fns.length === 0) {
            return callback();
        }
        let todo = fns.length;
        const cb = (err: Error) => {
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
    },
    /**
     * Attempts to run all funcs and callbacks positively on the first success.
     */
    some(fns: ((cb: (err: Error, data?: any) => void) => void)[], callback: (err: Error, data?: any) => void): void {
        if (fns.length === 0) {
            return callback(new Error('Empty array'));
        }
        let todo = fns.length;
        let firstFailed: Error;
        const cb = (err: Error, res: any) => {
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
    },
};

/**
 * Similar to Object.assign, but stricter and about 4x faster.
 */
export function assign<T>(target: T): T {
    for (let i = 1; i < arguments.length; i++) {
        const arg = arguments[i];
        if (!arg) {
            continue;
        }

        for (let k = 0, keys = Object.keys(arg); k < keys.length; k++) {
            target[keys[k]] = arg[keys[k]];
        }
    }

    return target;
}

/**
 * Returns a subset of attributes from the object.
 */
export function pick<T>(obj: T, attrs: string[]): T {
    const out: T = <T>{};
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
export function clone<T>(obj: T): T {
    return assign({}, obj);
}

/**
 * Escapes all RegEx control characters
 */
export function escapeRegExp(str: string) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
