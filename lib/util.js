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
                callback();
            }
        };

        for (let i = 0; i < fns.length; i++) {
            fns[i](cb);
        }
    },
};
