import Rule from '../types/rule';


exports.any = class extends Rule {
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

exports.required = class extends Rule {
    validate(params, callback) {
        if (params.value === undefined) {
            return callback(this.error(params));
        }

        callback();
    }

    static name() {
        return 'required';
    }
};
