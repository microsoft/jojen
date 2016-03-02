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

        return callback();
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

        return callback(this.error(params, {
            allowed: this._values,
        }));
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

        const target = (params.rules[0] || this)._allowed;
        this._values.forEach(value => {
            const index = target.indexOf(value);
            if (index === -1) {
                return;
            }
            target.splice(index, 1);
        });
    }

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

class Allow extends FlagRule {
    compile(params) {
        let args;
        if (Array.isArray(params.args[0])) {
            args = params.args[0];
        } else {
            args = params.args;
        }

        const target = (params.rules[0] || this)._allowed;
        args.forEach(value => {
            if (target.indexOf(value) !== -1) {
                return;
            }
            target.push(value);
        });
    }

    static ruleName() {
        return 'allow';
    }
}


module.exports = [Any, Required, Valid, Invalid, Optional, Forbidden, Allow];
