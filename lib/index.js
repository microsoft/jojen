import Validator from './validator';

const Jo = module.exports = function () {
    return new Validator();
};

// Default validator for Joi compatibility, so we can call methods like
// Jo.any(). More advanced users will want to subclass this.
const defaultValidator = new Validator();

Object.keys(defaultValidator)
    .concat(['validate', 'load'])
    .forEach((key) => {
        const prop = defaultValidator[key];
        if (key[0] === '_') {
            return; // don't export private things
        } else if (typeof prop === 'function') {
            Jo[key] = prop.bind(defaultValidator);
        } else {
            Jo[key] = prop;
        }
    });
