import Rule from '../types/rule';
import FlagRule from '../types/flagRule';

import { async, clone } from '../util';


class ObjectValidator extends Rule {
    operates() {
        return false;
    }

    static ruleName() {
        return 'object';
    }
}

class Keys extends Rule {
    compile(params) {
        this._obj = params.args[0];
        this._keys = Object.keys(params.args[0]);
        // If an Unknown rule is added later, it'll set this to true
        this._allowUnknown = false;
    }

    /**
     * Checks to see if the value contains unknown keys. Returns true and
     * calls back with an error if so.
     * @param  {Object}   params
     * @param  {Function} callback
     * @return {Boolean}
     */
    _validateUnknown(params, callback) {
        const keys = Object.keys(params.value);
        for (let i = 0; i < keys.length; i++) {
            if (this._keys.indexOf(keys[i]) === -1) {
                callback(this.error(params, { extra: keys[i], rule: 'object.unknown' }));
                return true;
            }
        }

        return false;
    }

    validate(params, callback) {
        const value = params.value;
        if (value === undefined || value === null) {
            return callback(this.error(params));
        }

        if (!this._allowUnknown && this._validateUnknown(params, callback)) {
            return undefined;
        }

        const todo = this._keys.map((key) => {
            const options = clone(params.options);
            options._path = options._path.concat([key]);

            return (done) => params.validator.validate(
                value[key],
                this._obj[key],
                options,
                done
            );
        });

        async.all(todo, callback);
    }

    static ruleName() {
        return 'object.keys';
    }
}

class Unknown extends FlagRule {
    compile(params) {
        const allow = params.args[0] === undefined ? true : params.args[0];
        this.invokeLast(params, Keys, (r) => { r._allowUnknown = allow; });
    }

    static ruleName() {
        return 'object.unknown';
    }
}


module.exports = [ObjectValidator, Keys, Unknown];
