import Rule from '../types/rule';
import ComparatorRule from '../types/comparatorRule';
import priority from '../priority';

class Any extends Rule {
    operates() {
        return false;
    }

    static ruleName() {
        return 'any';
    }
}

class Optional extends Rule {
    compile() {
        this._enabled = true;
    }

    validate(params, callback) {
        if (this._enabled && params.value === undefined) {
            return callback(undefined, { abort: true });
        }

        return callback();
    }

    _disable() {
        this._enabled = false;
    }

    priority() {
        return priority.halter;
    }


    static ruleName() {
        return 'optional';
    }
}

class Required extends Rule {
    compile(params) {
        params.invokeAll(Optional, rule => rule._disable());
    }

    validate(params, callback) {
        if (params.value === undefined) {
            return callback(this.error(params));
        }

        return callback();
    }

    static ruleName() {
        return 'required';
    }
}

/**
 * FlagRule class that is a generic interface for a rule that:
 *  - takes a list of values in its arguments
 *  - tries to compact those into a single top-level rule
 */
class BuiltComparatorRule extends ComparatorRule {
    compile(params) {
        let args;
        if (Array.isArray(params.args[0])) {
            args = params.args[0];
        } else {
            args = params.args;
        }

        if (!params.invokeFirst(this.constructor, (r) => { r._add(args); })) {
            this._values = args;
        }
    }

    operates() {
        return !!this._values;
    }

    _add(values) {
        this._values = this._values.concat(values);
    }
}

class Valid extends BuiltComparatorRule {
    validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this.compare(this._values[i], params.value)) {
                return callback(undefined, { abort: true });
            }
        }

        return callback(this.error(params, { allowed: this._values }));
    }

    priority() {
        return priority.halter;
    }

    static ruleName() {
        return 'valid';
    }
}

class Invalid extends BuiltComparatorRule {
    validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this.compare(this._values[i], params.value)) {
                return callback(this.error(params, {
                    value: params.value,
                }));
            }
        }

        return callback();
    }

    static ruleName() {
        return 'invalid';
    }
}

class Forbidden extends Rule {
    validate(params, callback) {
        if (params.value !== undefined) {
            return callback(this.error(params));
        }

        return callback();
    }

    static ruleName() {
        return 'forbidden';
    }
}

class Allow extends BuiltComparatorRule {
    validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this.compare(this._values[i], params.value)) {
                return callback(undefined, { abort: true });
            }
        }

        return callback();
    }

    priority() {
        return priority.halter;
    }

    static ruleName() {
        return 'allow';
    }
}


module.exports = [Any, Required, Valid, Invalid, Optional, Forbidden, Allow];
