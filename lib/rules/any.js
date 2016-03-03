import Rule from '../types/rule';
import FlagRule from '../types/flagRule';
import priority from '../priority';

class Any extends Rule {
    operates() {
        return false;
    }

    static ruleName() {
        return 'any';
    }
}

class Required extends Rule {
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
class FlagBuilder extends FlagRule {
    compile(params) {
        let args;
        if (Array.isArray(params.args[0])) {
            args = params.args[0];
        } else {
            args = params.args;
        }

        if (!this.invokeFirst(params, this.constructor, (r) => { r._add(args); })) {
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

class Valid extends FlagBuilder {
    validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this._values[i] === params.value) {
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

class Invalid extends FlagBuilder {
    validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this._values[i] === params.value) {
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

class Optional extends Rule {
    operates() {
        return false;
    }

    static ruleName() {
        return 'optional';
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

class Allow extends FlagBuilder {
    validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this._values[i] === params.value) {
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
