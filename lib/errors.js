function ValidationError(rule, params) {
    Error.call(this, `Validator ${rule.name()} has failed.`);

    this.isJoi = true; // shh! They'll never find us!
    this.name = 'ValidationError';

    this._rule = rule;
    this._object = params.value;

    const valuePath = ['value'].concat(params.path);
    this.details = [{
        path: valuePath.join('.'),
        type: rule.name(),
        context: {
            key: valuePath[valuePath.length - 1],
        },
    }];
}
ValidationError.prototype = Object.create(Error.prototype);

/**
 * Attaches the error to a language definition in
 * order to fill out its details.
 * @param  {Object} language
 */
ValidationError.prototype.attach = function (language) {
    for (let i = 0; i < this.details.length; i++) {
        const detail = this.details[i];
        if (!language.hasOwnProperty(detail.type)) {
            continue;
        }

        detail.message = language[detail.type](
            detail.context.key,
            this._rule._params,
            this._object
        );
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

exports.ValidationError = ValidationError;
