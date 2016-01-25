module.exports = {
    required: (opts) => `"${opts.key}" is required`,
    forbidden: (opts) => `"${opts.key}" is not allowed`,

    'object.keys': (opts) => `"${opts.key}" is not an object`,
    'object.unknown': (opts) => `"${opts.key}" should not have "${opts.extra}"`,
};
