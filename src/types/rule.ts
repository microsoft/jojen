import { ValidationError } from '../errors';
import { priority } from '../priority';
import { RuleParams } from '../RuleParams';
import * as deepEqual from 'deep-equal';

export interface IRuleCtor<T extends Rule> {
    new (value?: any) : T;
}

/**
 * Base rule class that all validation functions must implement.
 */
export abstract class Rule {
    public params: any[];

    /**
     * Called when the rule is created, with arguments passed in. For
     * example, `.rule(1, 2)` will cause this to be invoked with the
     * arguments `1, 2`.
     */
    public compile(params: RuleParams) {
        return;
    }

    /**
     * Sets the rule parameters for equality checking later.
     */
    private setParams(...args: any[]) {
        this.params = args;
    }

    /**
     * Returns whether the rule actually runs operations. If this is
     * false, the rule is disabled.
     */
    public operates(): boolean {
        return true;
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
    public abstract validate(params: Object, cb: (err: ValidationError, value?: any) => void): void;

    /**
     * Attempts to coerce the value to the match this rule. This will only
     * be run if validation fails and the `convert` options is passed, and
     * we'll run validation again after coercion to make sure it worked.
     *
     * Returning undefined from this function signals that no coercion
     * took place.
     */
    public coerce(val: any): any {
        return undefined;
    }

    /**
     * Returns a single ValidationError Used to signal a failure on *this* rule.
     * @param {Object} params as passed to validate()
     * @param {Object} [info] additional information about the failure
     * @return {ValidationError}
     */
    public error (params, info?): ValidationError {
        return new ValidationError(this, params, info);
    }

    /**
     * Method to return the rule's static name.
     * This should not be overridden.
     */
    public name(): string {
        return this.constructor.ruleName();
    }

    /**
     * Returns whether this rule is identical to another.
     */
    public identicalTo(rule: Rule): boolean {
        return rule instanceof Rule &&
            this.name() === rule.name() &&
            deepEqual(this.params, rule.params);
    }

    /**
     * Returns the priority of this rule; lower priority rules will be
     * run first.
     */
    public priority(): number {
        return priority.normal;
    }

    /**
     * Returns the name of the rule, invoked like Jo.name(options...)
     */
    public static ruleName () {
        throw new Error('not implemented');
    }
}
