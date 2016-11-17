import { Rule } from '../types/rule';

import { async, clone } from '../util';
import * as deepEqual from 'deep-equal';


class ArrayValidator extends Rule {
    constructor() {
        super();
        this._allowSingle = false;
        this._allowSparse = false;
    }

    public coerce(value: any) {
        if (this._allowSingle && !Array.isArray(value)) {
            return [value];
        }

        return undefined;
    }

    public validate(params, callback) {
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

    public static ruleName() {
        return 'array';
    }
}

class Sparse extends Rule {
    public compile(params) {
        const allow = params.args[0] === undefined ? true : params.args[0];
        params.invokeLast(ArrayValidator, (r) => { r._allowSparse = allow; });
    }

    public operates() {
        return false;
    }

    public static ruleName() {
        return 'array.sparse';
    }
}

class Single extends Rule {
    public compile(params) {
        const allow = params.args[0] === undefined ? true : params.args[0];
        params.invokeLast(ArrayValidator, (r) => { r._allowSingle = allow; });
    }

    public operates() {
        return false;
    }

    public static ruleName() {
        return 'array.single';
    }
}

class Items extends Rule {
    public compile(params) {
        this._schema = params.args[0];
    }

    public validate(params, callback) {
        const todo = params.value.map((item, index) => {
            const options = clone(params.options);
            options._path = options._path.concat(`[${index}]`);

            return (done) => params.validator.validate(item, this._schema, options, done);
        });

        async.all(todo, callback);
    }

    public static ruleName() {
        return 'array.items';
    }
}

class Ordered extends Rule {
    public compile(params) {
        this._schemas = params.args;
    }

    public validate(params, callback) {
        const length = this._schemas.length;
        const expected = params.value.length;
        if (length !== expected) {
            return callback(this.error(params, { length, expected }));
        }

        const todo = this._schemas.map((schema, index) => {
            const options = clone(params.options);
            options._path = options._path.concat(`[${index}]`);

            return (done) => params.validator.validate(params.value[index], schema, options, done);
        });

        return async.all(todo, callback);
    }

    public static ruleName() {
        return 'array.ordered';
    }
}

class Min extends Rule {
    public compile(params) {
        this._val = params.args[0];
    }

    public validate(params, callback) {
        const length = params.value.length;
        const min = this._val;
        if (length < min) {
            return callback(this.error(params, { length, min }));
        }

        return callback();
    }

    public static ruleName() {
        return 'array.min';
    }
}

class Max extends Rule {
    public compile(params) {
        this._val = params.args[0];
    }

    public validate(params, callback) {
        const length = params.value.length;
        const max = this._val;
        if (length > max) {
            return callback(this.error(params, { length, max }));
        }

        return callback();
    }

    public static ruleName() {
        return 'array.max';
    }
}

class Length extends Rule {
    public compile(params) {
        this._val = params.args[0];
    }

    public validate(params, callback) {
        const length = params.value.length;
        const expected = this._val;
        if (length !== expected) {
            return callback(this.error(params, { length, expected }));
        }

        return callback();
    }

    public static ruleName() {
        return 'array.length';
    }
}

class Unique extends Rule {
    public validate(params, callback) {
        const v = params.value;
        const l = v.length;
        for (let i = 0; i < l; i++) {
            for (let k = i + 1; k < l; k++) {
                if (deepEqual(v[i], v[k])) {
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

    public static ruleName() {
        return 'array.unique';
    }
}


module.exports = [ArrayValidator, Sparse, Single, Items, Ordered, Max, Min, Length, Unique];
