import Validator from './validator';
import { ILanguage } from './lang';

export default function () {
    return new Validator();
}

import { english } from './lang/en';


// Default validator for Joi compatibility, so we can call methods like
// Jo.any(). More advanced users will want to subclass this.
const defaultValidator = new Validator();
defaultValidator.load(english);

Object
    .keys(defaultValidator)
    .concat(['validate', 'load', 'assert', 'validateSync'])
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
