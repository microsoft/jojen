import Validator from './validator';

const Jo = module.exports = function () {
    return new Validator();
};

// Default validator for Joi compatibility, so we can call methods like
// Jo.any(). More advanced users will want to subclass this.
const defaultValidator = new Validator();

Object.keys(defaultValidator)
    .concat(Object.keys(Validator.prototype))
    .forEach((key) => {
        Jo[key] = defaultValidator[key].bind(defaultValidator);
    });
