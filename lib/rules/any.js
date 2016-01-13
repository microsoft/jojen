import Validator from '../types/validator';


exports.any = class extends Validator {
    validate(params, callback) {
        callback();
    }

    static getChildren() {
        return [
            Required
        ];
    }

    static name() {
        return 'any';
    }
};

exports.required = class extends Validator {
    validate(params, callback) {
        if (params.value === undefined) {
            return callback(this.error(params));
        }

        callback();
    }

    static name() {
        return 'any.required';
    }
};
