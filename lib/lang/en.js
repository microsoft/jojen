module.exports = {
    required: (opts) => `"${opts.key}" is required`,
    forbidden: (opts) => `"${opts.key}" is not allowed`,

    'object.keys': (opts) => {
        if (opts.info.extra) {
            return `"${opts.key}" should not have "${opts.info.extra}"`;
        }

        return `"${opts.key}" is not an object`;
    },
};
