export const english = {
    required: opts => `"${opts.key}" is required.`,
    forbidden: opts => `"${opts.key}" is forbidden.`,

    invalid: opts => `"${opts.key}" must not equal ${opts.value}.`,
    valid: opts => `"${opts.key}" is not valid and must be ${opts.allowed.join()}.`,

    'object.keys': opts => `"${opts.key}" is not an object.`,
    'object.unknown': opts => `"${opts.key}" should not have "${opts.extra}".`,

    array: opts => `"${opts.key}" must be an array.`,
    'array.sparse': opts => `"${opts.key}" must be sparse.`,
    'array.ordered': opts => `"${opts.key}" must be ordered.`,
    'array.min': opts => `"${opts.key}" must have at least ${opts.min} elements.`,
    'array.max': opts => `"${opts.key}" may not have more than ${opts.max} elements.`,
    'array.length': opts => `"${opts.key}" must have exactly ${opts.length} elements.`,
    'array.unique': opts =>
        `"${opts.key}" must be unique but duplicate "${opts.violator.value}" was found at index ${opts.violator.index}.`,

    string: opts => `"${opts.key}" must be a string`,
    'string.min': opts => `"${opts.key}" must be at least ${opts.min} characters long.`,
    'string.max': opts => `"${opts.key}" may not be more than ${opts.max} characters long.`,
    'string.length': opts => `"${opts.key}" must be exactly ${opts.length} characters long.`,
    'string.creditCard': opts => `"${opts.key}" must be a credit card number.`,
    'string.regex': opts => `"${opts.key}" must match the RegEx ${opts.regEx}.`,
    'string.alphanum': opts => `"${opts.key}" must be exactly alpha-numeric.`,
    'string.token': opts => `"${opts.key}" must be be a token ([0-9a-z_]+).`,
    'string.email': opts => `"${opts.key}" must be a valid Email address.`,
    'string.ip': opts => {
        if (opts.reason === 'not-matched') {
            return `"${opts.key}" must be a valid ${opts.allowed.join(' or ')} address.`;
        }
        if (opts.reason === 'cidr-required') {
            return `"${opts.key}" must contain a valid CIDR.`;
        }
        if (opts.reason === 'cidr-not-allowed') {
            return `"${opts.key}" must not contain a CIDR.`;
        }
        return '';
    },
    'string.uri': opts => {
        if (opts.reason === 'scheme not allowed') {
            return `"${opts.key}" scheme must be ${opts.allowed.join(' or ')}.`;
        }
        if (opts.reason === 'relativ-not-allowed') {
            return `"${opts.key}" must be an absolute URL.`;
        }
        return `"${opts.key}" must be valid URL.`;
    },
    'string.guid': opts => `"${opts.key}" must be an GUID.`,
    'string.hex': opts => `"${opts.key}" must be hexadecimal.`,
    'string.hostname': opts => `"${opts.key}" must be a valid hostname.`,
    'string.lowercase': opts => `"${opts.key}" must be lower case.`,
    'string.uppercase': opts => `"${opts.key}" must be a upper case.`,
    'string.trim': opts => `"${opts.key}" must be trimmed.`,
    'string.isoDate': opts => `"${opts.key}" must be a valid ISO date.`,

    boolean: opts => `"${opts.key}" must be a boolean.`,

    func: opts => `"${opts.key}" must be a function.`,
    'func.arity': opts => `"${opts.key}" must have exactly ${opts.expected} arguments.`,
    'func.minArity': opts => `"${opts.key}" must have at least ${opts.min} arguments.`,
    'func.maxArity': opts => `"${opts.key}" may not have more than ${opts.max} arguments.`,

    number: opts => `"${opts.key}" must be a number.`,
    'number.integer': opts => `"${opts.key}" must be a an integer.`,
    'number.min': opts => `"${opts.key}" must greater or equal ${opts.min}.`,
    'number.max': opts => `"${opts.key}" must less or equal ${opts.max}.`,
    'number.greater': opts => `"${opts.key}" must greater than ${opts.greater}.`,
    'number.less': opts => `"${opts.key}" must less than ${opts.less}.`,
    'number.negative': opts => `"${opts.key}" must be negative.`,
    'number.positive': opts => `"${opts.key}" must be positive.`,
    'number.multiple': opts => `"${opts.key}" must be multiple of ${opts.multiple}.`,
    'number.precision': opts => `"${opts.key}" must have a max precision of ${opts.limit}.`,

    date: opts => `"${opts.key}" must be an iso date.`,
    'date.greaterThanNow': opts => `"${opts.key}" must be a date in the future.`,
};
