import Rule from '../types/rule';
import FlagRule from '../types/flagRule';


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

        callback();
    }

    static ruleName() {
        return 'required';
    }
}

class Valid extends FlagRule {
    compile(params) {
        let args;
        if (Array.isArray(params.args[0])) {
            args = params.args[0];
        } else {
            args = params.args;
        }

        if (!this.invokeFirst(params, Valid, (r) => { r._add(args); })) {
            this._values = args;
        }
    }

    operates() {
        return !!this._values;
    }

    validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this._values[i] === params.value) {
                return callback();
            }
        }

        return callback(this.error(params));
    }

    _add(values) {
        this._values = this._values.concat(values);
    }

    static ruleName() {
        return 'valid';
    }
}

class Invalid extends Rule {
    compile(params) {
        if (Array.isArray(params.args[0])) {
            this._values = params.args[0];
        } else {
            this._values = params.args;
        }
    }

    validate(params, callback) {
        for (let i = 0; i < this._values.length; i++) {
            if (this._values[i] === params.value) {
                return callback(this.error(params));
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

        callback();
    }

    static ruleName() {
        return 'forbidden';
    }
}


module.exports = [Any, Required, Valid, Invalid, Optional, Forbidden];
