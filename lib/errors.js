import { assign, pick } from './util';

function ValidationError(rule, params, info) {
    const opts = assign({}, params, {
        rule: rule.name(),
        ruleParams: rule._params,
    }, info);
    const key = opts.path[opts.path.length - 1];

    this.isJoi = true; // shh! They'll never find us!
    this.name = 'ValidationError';
    this._opts = opts;
    this._opts.key = key;

    this.details = [{
        path: opts.path.join('.'),
        type: opts.rule,
        context: { key },
    }];
}
ValidationError.prototype = Object.create(Error.prototype);

/**
 * Object passed to language definitions to spit out a pretty message.
 * @typedef {Object} ValidationLanguageOptions
 * @param {String} key - the key of the value that failed validation
 * @param {Object} params - original params object the rule was created with
 * @param {*} value - the object under validation
 * @param {*} info - optional additional info returned from the validation rule
 */

/**
 * Attaches the error to a language definition in
 * order to fill out its details.
 * @param  {Object} language
 */
ValidationError.prototype.attach = function (language) {
    if (!language) {
        return;
    }

    for (let i = 0; i < this.details.length; i++) {
        const detail = this.details[i];
        if (!language.hasOwnProperty(detail.type)) {
            continue;
        }

        detail.message = language[detail.type](this._opts);
    }
};

/**
 * Combines the details of this error with another, returning the current
 * (now mutated) error.
 * @param  {ValidationError} err
 * @return {ValidationError}
 */
ValidationError.prototype.union = function (err) {
    this.details = this.details.concat(err.details);
    return this;
};

/**
 * Returns a subset of attributes for representation as JSON.
 * @return {String}
 */
ValidationError.prototype.toJSON = function () {
    return pick(this, ['isJoi', 'name', 'details']);
};

exports.ValidationError = ValidationError;
