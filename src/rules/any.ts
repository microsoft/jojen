import { Rule } from '../types/rule';
import { ComparatorRule } from '../types/comparatorRule';
import priority from '../priority';

import { RuleParams } from '../RuleParams';

class Any extends Rule {
    public operates() {
        return false;
    }

    public static ruleName() {
        return 'any';
    }
}

class Optional extends Rule {
    private enabled: boolean;
    public compile() {
        this.enabled = true;
    }

    public validate(params, callback) {
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


    public static ruleName() {
        return 'optional';
    }
}

class Required extends Rule {
    public compile(params: RuleParams) {
        params.invokeAll(Optional, rule => rule.disable());
    }

    public validate(params, callback) {
        if (params.value === undefined) {
            return callback(this.error(params));
        }

        return callback();
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
class BuiltComparatorRule extends ComparatorRule {
    protected values: any[] = [];
    public compile(params: RuleParams) {
        let args;
        if (Array.isArray(params.args[0])) {
            args = params.args[0];
        } else {
            args = params.args;
        }

        if (!params.invokeFirst(this.constructor, r => { r.add(args); })) {
            this.values = args;
        }
    }

    public operates() {
        return !!this.values;
    }

    private add(values) {
        this.values = this.values.concat(values);
    }
}

class Valid extends BuiltComparatorRule {
    public validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this.compare(this._values[i], params.value)) {
                return callback(undefined, { abort: true });
            }
        }

        return callback(this.error(params, { allowed: this._values }));
    }

    public priority() {
        return priority.halter;
    }

    public static ruleName() {
        return 'valid';
    }
}

class Invalid extends BuiltComparatorRule {
    public validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this.compare(this._values[i], params.value)) {
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

class Forbidden extends Rule {
    public validate(params, callback) {
        if (params.value !== undefined) {
            return callback(this.error(params));
        }

        return callback();
    }

    public static ruleName() {
        return 'forbidden';
    }
}

class Allow extends BuiltComparatorRule {
    public validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this.compare(this._values[i], params.value)) {
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

class Custom extends Rule {
    public compile(params) {
        this._func = params.args[0];
    }

    public validate(params, callback) {
        try {
            this._func(params.value, error => {
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

class Default extends Rule {
    public compile(params: RuleParams) {
        this._default = params.args[0];
    }

    public priority() {
        return priority.valueOverride;
    }

    public static ruleName() {
        return 'default';
    }
}


module.exports = [Any, Required, Valid, Invalid, Optional, Forbidden, Allow, Custom, Default];
