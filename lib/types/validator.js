/**
 * Base validator class that all validation functions must implement.
 */
export default class Validator {
    /**
     * Called when the validator is created, with arguments passed in. For
     * example, `.rule(1, 2)` will cause this to be invoked with the
     * arguments `1, 2`.
     *
     * @param {...} options
     */
    compile() {
        return;
    }

    /**
     * Returns child validators of this validator.
     * @return {[]Validator}
     */
    getChildren() {
        return [];
    }

    /**
     * Returns whether or not the provided value passes validation. It should
     * return an array of ValidationErrors if it fails.
     * @param  {Object}   params
     * @param  {*}        params.value
     * @param  {[]String} params.path
     * @param  {Function} callback Should be called with an array of
     *                             ValidatorErrors, or nothing.
     */
    validate(params, callback) {
        throw new Error('not implemented');
    }

    /**
     * Returns a single ValidationError in an array. Used to signal a
     * failure on *this* rule.
     * @param {Object} params as passed to validate()
     * @return {[]ValidatorError}
     */
    error(params) {
        return [ new ValidatorError(this.name(), params.path) ];
    }

    /**
     * Method to return the validator's static name.
     * This should not be overridden.
     * @return {String}
     */
    name() {
        return this.constructor.name();
    }

    /**
     * Returns the name of the validator, invoked like Jo.name(options...)
     * @return {String}
     */
    static name() {
        throw new Error('not implemented');
    }
}
