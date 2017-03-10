import * as deepEqual from 'deep-equal';

import { ValidationError } from '../errors';
import { priority } from '../priority';
import { RuleParams } from '../RuleParams';
import { IValidationOptions, Validator } from '../validator';
import { IRuleValidationParams } from './rule';

export interface IRuleCtor<T extends Rule> extends Function {
    new (value?: any) : T;
    ruleName(): string;
}

export interface IRuleValidationParams<T> {
    value: T;
    validator: Validator;
    path: string[];
    options: IValidationOptions;
    key?: string;
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
    public compile(_params: RuleParams) {
        return;
    }

    /**
     * Sets the rule parameters for equality checking later.
     */
    public setParams(...args: any[]) {
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
     */
    public abstract validate(params: IRuleValidationParams<any>, cb: (err: ValidationError, value?: any) => void): void;

    /**
     * Attempts to coerce the value to the match this rule. This will only
     * be run if validation fails and the `convert` options is passed, and
     * we'll run validation again after coercion to make sure it worked.
     *
     * Returning undefined from this function signals that no coercion
     * took place.
     */
    public coerce(_val: any): any {
        return undefined;
    }

    /**
     * Returns a single ValidationError Used to signal a failure on *this* rule.
     */
    public error (params: IRuleValidationParams<any>, info?: {}): ValidationError {
        return new ValidationError(this, params, info);
    }

    /**
     * Method to return the rule's static name.
     * This should not be overridden.
     */
    public name(): string {
        return (<typeof Rule>this.constructor).ruleName();
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
    public static ruleName (): string {
        throw new Error('not implemented');
    }
}

export class NonOperatingRule extends Rule {
    public validate(_params: Object, _cb: (err: ValidationError, value?: any) => void): void {
        throw new Error('Should never be called');
    }
}
