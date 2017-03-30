import Rule from '../types/rule';

import { async, clone, get } from '../util';
import eq from 'deep-equal';


class ArrayValidator extends Rule {
    constructor() {
        super();
        this._allowSingle = false;
        this._allowSparse = false;
    }

    coerce(value) {
        if (this._allowSingle && !Array.isArray(value)) {
            return [value];
        }

        return undefined;
    }

    validate(params, callback) {
        if (!Array.isArray(params.value)) {
            return callback(this.error(params));
        }

        if (!this._allowSparse) {
            for (let i = 0; i < params.value.length; i++) {
                if (params.value[i] === undefined) {
                    return callback(this.error(params, { rule: 'array.sparse' }));
                }
            }
        }

        return callback();
    }

    static ruleName() {
        return 'array';
    }
}

class Sparse extends Rule {
    compile(params) {
        const allow = params.args[0] === undefined ? true : params.args[0];
        params.invokeLast(ArrayValidator, (r) => { r._allowSparse = allow; });
    }

    operates() {
        return false;
    }

    static ruleName() {
        return 'array.sparse';
    }
}

class Single extends Rule {
    compile(params) {
        const allow = params.args[0] === undefined ? true : params.args[0];
        params.invokeLast(ArrayValidator, (r) => { r._allowSingle = allow; });
    }

    operates() {
        return false;
    }

    static ruleName() {
        return 'array.single';
    }
}

class Items extends Rule {
    compile(params) {
        this._schema = params.args[0];
    }

    validate(params, callback) {
        return async.map(params.value, (item, index) => {
            const options = clone(params.options);
            options._path = options._path.concat(`[${index}]`);

            return (done) => params.validator.validate(item, this._schema, options, done);
        }, callback);
    }

    static ruleName() {
        return 'array.items';
    }
}

class Ordered extends Rule {
    compile(params) {
        this._schemas = params.args;
    }

    validate(params, callback) {
        const length = this._schemas.length;
        const expected = params.value.length;
        if (length !== expected) {
            return callback(this.error(params, { length, expected }));
        }

        return async.map(this._schemas, (schema, index) => {
            const options = clone(params.options);
            options._path = options._path.concat(`[${index}]`);

            return (done) => params.validator.validate(params.value[index], schema, options, done);
        }, callback);
    }

    static ruleName() {
        return 'array.ordered';
    }
}

class Min extends Rule {
    compile(params) {
        this._val = params.args[0];
    }

    validate(params, callback) {
        const length = params.value.length;
        const min = this._val;
        if (length < min) {
            return callback(this.error(params, { length, min }));
        }

        return callback();
    }

    static ruleName() {
        return 'array.min';
    }
}

class Max extends Rule {
    compile(params) {
        this._val = params.args[0];
    }

    validate(params, callback) {
        const length = params.value.length;
        const max = this._val;
        if (length > max) {
            return callback(this.error(params, { length, max }));
        }

        return callback();
    }

    static ruleName() {
        return 'array.max';
    }
}

class Length extends Rule {
    compile(params) {
        this._val = params.args[0];
    }

    validate(params, callback) {
        const length = params.value.length;
        const expected = this._val;
        if (length !== expected) {
            return callback(this.error(params, { length, expected }));
        }

        return callback();
    }

    static ruleName() {
        return 'array.length';
    }
}

class Unique extends Rule {
    compile(params) {
        const comp = params.args[0];
        if (typeof comp === 'string') {
            this._key = comp;
        } else if (comp instanceof Function) {
            this._compFn = comp;
        }
    }

    validate(params, callback) {
        const v = params.value;
        const l = v.length;
        for (let i = 0; i < l; i++) {
            for (let k = i + 1; k < l; k++) {
                let isEqual = false;
                if (this._compFn) {
                    isEqual = this._compFn(v[i], v[k]);
                } else if (this._key) {
                    isEqual = eq(get(v[i], this._key), get(v[k], this._key));
                } else {
                    isEqual = eq(v[i], v[k]);
                }
                if (isEqual) {
                    return callback(this.error(params, {
                        violator: {
                            index: k,
                            value: v[k],
                        },
                    }));
                }
            }
        }

        return callback();
    }

    static ruleName() {
        return 'array.unique';
    }
}


module.exports = [ArrayValidator, Sparse, Single, Items, Ordered, Max, Min, Length, Unique];
