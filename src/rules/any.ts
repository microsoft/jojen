import { priority } from '../priority';
import { RuleParams } from '../RuleParams';
import { BuiltComparatorRule } from '../types/BuiltComparatorRule';
import {
    IRuleValidationParams,
    NonOperatingRule,
    Rule,
} from '../types/Rule';
import { SyncRule } from '../types/SyncRule';

export class Any extends NonOperatingRule {
    public operates() {
        return false;
    }

    public static ruleName() {
        return 'any';
    }

    public getErrorMessage(): string {
        return '';
    }
}

export class Optional extends Rule {
    private enabled: boolean;
    public compile() {
        this.enabled = true;
    }

    public validate(params: IRuleValidationParams<any, void>, callback: (error?: Error, data?: any) => void) {
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

    public getErrorMessage(): string {
        return '';
    }
}

export class Required extends SyncRule {
    public compile(params: RuleParams) {
        params.invokeAll(Optional, rule => rule.disable());
    }

    public validateSync(params: IRuleValidationParams<any, void>) {
        return params.value !== undefined;
    }

    public static ruleName() {
        return 'required';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" is required.`;
    }
}

export class Valid extends BuiltComparatorRule {
    public validate(params: IRuleValidationParams<any, void>, callback: (error?: Error, data?: any) => void) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" is not valid and must be ${this.values.join()}.`;
    }
}

export class Invalid extends BuiltComparatorRule {
    public validate(params: IRuleValidationParams<any, void>, callback: (error?: Error, data?: any) => void) {
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

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must not be equal ${this.values.join()}.`;
    }
}

export class Forbidden extends SyncRule {
    public validateSync(params: IRuleValidationParams<any, void>) {
        return params.value === undefined;
    }

    public static ruleName() {
        return 'forbidden';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" is forbidden.`;
    }
}

export class Allow extends BuiltComparatorRule {
    public validate(params: IRuleValidationParams<any, void>, callback: (error?: Error, data?: any) => void) {
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

    public getErrorMessage(): string {
        return '';
    }
}

export class Custom extends Rule {
    private func: (value: any, cb: (error: Error) => void) => void;
    public compile(params: RuleParams) {
        this.func = params.args[0];
    }

    public validate(params: IRuleValidationParams<any, void>, callback: (error?: Error, data?: any) => void) {
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

    public getErrorMessage(): string {
        return '';
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

    public getErrorMessage(): string {
        return '';
    }
}
