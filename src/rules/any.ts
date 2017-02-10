import { priority } from '../priority';
import { RuleParams } from '../RuleParams';
import { ComparatorRule } from '../types/comparatorRule';
import {
    IRuleCtor,
    IRuleValidationParams,
    NonOperatingRule,
    Rule,
} from '../types/rule';
import { SyncRule } from '../types/syncRule';

export class Any extends NonOperatingRule {
    public operates() {
        return false;
    }

    public static ruleName() {
        return 'any';
    }
}

export class Optional extends Rule {
    private enabled: boolean;
    public compile() {
        this.enabled = true;
    }

    public validate(params: IRuleValidationParams<any>, callback: (error?: Error, data?: any) => void) {
        if (this.enabled && params.value === undefined) {
            return callback(undefined, { abort: true });
        }

        return callback();
    }

    public disable() {
        this.enabled = false;
    }

    public priority() {
        return priority.halter;
    }

    public static ruleName(): string {
        return 'optional';
    }
}

export class Required extends SyncRule {
    public compile(params: RuleParams) {
        params.invokeAll(Optional, rule => rule.disable());
    }

    public validateSync(params: IRuleValidationParams<any>) {
        return params.value !== undefined;
    }

    public static ruleName() {
        return 'required';
    }
}

/**
 * FlagRule class that is a generic interface for a rule that:
 *  - takes a list of values in its arguments
 *  - tries to compact those into a single top-level rule
 */
export abstract class BuiltComparatorRule extends ComparatorRule {
    protected values: any[] = [];
    public compile(params: RuleParams) {
        let args: any[];
        if (Array.isArray(params.args[0])) {
            args = params.args[0];
        } else {
            args = params.args;
        }

        if (!params.invokeFirst(<IRuleCtor<BuiltComparatorRule>>this.constructor, r => { r.add(args); })) {
            this.values = args;
        }
    }

    public operates() {
        return !!this.values;
    }

    public add (values: any[]) { // TODO: Actually private.
        this.values = this.values.concat(values);
    }
}

export class Valid extends BuiltComparatorRule {
    public validate(params: IRuleValidationParams<any>, callback: (error?: Error, data?: any) => void) {
        for (let i = 0; i < this.values.length; i++) {
            if (this.compare(this.values[i], params.value)) {
                return callback(undefined, { abort: true });
            }
        }

        return callback(this.error(params, { allowed: this.values }));
    }

    public priority() {
        return priority.halter;
    }

    public static ruleName() {
        return 'valid';
    }
}

export class Invalid extends BuiltComparatorRule {
    public validate(params: IRuleValidationParams<any>, callback: (error?: Error, data?: any) => void) {
        for (let i = 0; i < this.values.length; i++) {
            if (this.compare(this.values[i], params.value)) {
                return callback(this.error(params, {
                    value: params.value,
                }));
            }
        }

        return callback();
    }

    public static ruleName() {
        return 'invalid';
    }
}

export class Forbidden extends SyncRule {
    public validateSync(params: IRuleValidationParams<any>) {
        return params.value === undefined;
    }

    public static ruleName() {
        return 'forbidden';
    }
}

export class Allow extends BuiltComparatorRule {
    public validate(params: IRuleValidationParams<any>, callback: (error?: Error, data?: any) => void) {
        for (let i = 0; i < this.values.length; i++) {
            if (this.compare(this.values[i], params.value)) {
                return callback(undefined, { abort: true });
            }
        }

        return callback();
    }

    public priority() {
        return priority.halter;
    }

    public static ruleName() {
        return 'allow';
    }
}

export class Custom extends Rule {
    private func: (value: any, cb: (error: Error) => void) => void;
    public compile(params: RuleParams) {
        this.func = params.args[0];
    }

    public validate(params: IRuleValidationParams<any>, callback: (error?: Error, data?: any) => void) {
        try {
            this.func(params.value, error => {
                if (error) { // error is equivalent to details
                    return callback(this.error(params, error));
                }
                return callback();
            });
        } catch (error) {
            callback(this.error(params, {
                message: `Failed with error ${error.message}`,
            }));
        }
    }

    public static ruleName() {
        return 'custom';
    }
}

export class Default extends NonOperatingRule {
    public default: any;
    public compile(params: RuleParams) {
        this.default = params.args[0];
    }

    public priority() {
        return priority.valueOverride;
    }

    public static ruleName() {
        return 'default';
    }
}
