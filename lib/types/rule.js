import { ValidationError } from '../errors';
import eq from 'lodash.isequal';

/**
 * Base rule class that all validation functions must implement.
 */
export default class Rule {
    /**
     * Called when the rule is created, with arguments passed in. For
     * example, `.rule(1, 2)` will cause this to be invoked with the
     * arguments `1, 2`.
     *
     * @param {...} options
     */
    compile() {
        return;
    }

    /**
     * Sets the rule parameters for equality checking later.
     */
    _setParams() {
        const args = new Array(arguments.length);
        for (let i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        this._params = args;
    }

    /**
     * Returns whether the rule actually runs operations. If this is
     * false, the rule is disabled.
     * @return {Boolean}
     */
    operates() {
        return true;
    }

    /**
     * Returns an array of rules that should be run *before* this rule runs.
     * In essence, this defines dependencies. This method will be called
     * after .compile() is called.
     * @return {[]Rule}
     */
    hoist() {
        return [];
    }

    /**
     * Returns whether or not the provided value passes validation. It should
     * return an array of ValidationErrors if it fails.
     * @param  {Object}   params
     * @param  {*}        params.value
     * @param  {[]String} params.path
     * @param  {Function} callback Should be called with a
     *                             ValidationError, or nothing.
     */
    validate() {
        throw new Error('not implemented');
    }

    /**
     * Attempts to coerce the value to the match this rule. This will only
     * be run if validation fails and the `convert` options is passed, and
     * we'll run validation again after coercion to make sure it worked.
     *
     * Returning undefined from this function signals that no coercion
     * took place.
     *
     * @param  {*} value
     * @return {*}
     */
    coerce() {
        return undefined;
    }

    /**
     * Returns a single ValidationError Used to signal a failure on *this* rule.
     * @param {Object} params as passed to validate()
     * @return {ValidationError}
     */
    error(params) {
        return new ValidationError(this, params);
    }

    /**
     * Method to return the rule's static name.
     * This should not be overridden.
     * @return {String}
     */
    name() {
        return this.constructor.ruleName();
    }

    /**
     * Returns whether this rule is identical to another.
     * @param  {Rule} rule
     * @return {Boolean}
     */
    identicalTo(rule) {
        return rule instanceof Rule &&
            this.name() === rule.name() &&
            eq(this._params, rule._params);
    }

    /**
     * Returns the name of the rule, invoked like Jo.name(options...)
     * @return {String}
     */
    static ruleName() {
        throw new Error('not implemented');
    }
}
