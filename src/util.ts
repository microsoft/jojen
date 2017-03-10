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

    /**
     * Map an array to a function in parallel.
     */
    map<T, R>(
        collection: T[],
        iteratee: (item: T, index: number) =>
            ((done: (error?: Error, data?: R) => void) => void),
        callback: (err: Error, items?: R[]) => void
    ) {
        async.all(collection.map((item, index) => iteratee(item, index)), callback);
    },
};

/**
 * Similar to Object.assign, but stricter and about 4x faster.
 */
export function assign<T, U>(target: T, source: U): T & U;
export function assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function assign(target: any, ...args: any[]): any {
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg) {
            continue;
        }

        const keys = Object.keys(arg);
        for (let k = 0; k < keys.length; k++) {
            target[keys[k]] = arg[keys[k]];
        }
    }

    return target;
}

/**
 * Returns a subset of attributes from the object.
 */
export function pick<T>(obj: T, attrs: (keyof T)[]): T {
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
    return assign(<T>{}, obj);
}

/**
 * Escapes all RegEx control characters
 */
export function escapeRegExp(str: string) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
