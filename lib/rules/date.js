import SyncRule from '../types/syncRule';

// eslint-disable-next-line
const strictISO = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/;

class DateValidator extends SyncRule {
    coerce(value) {
        if (typeof value === 'string' && strictISO.test(value)) {
            return new Date(value);
        }
        return undefined;
    }

    validateSync(params) {
        return params.value instanceof Date;
    }

    static ruleName() {
        return 'date';
    }
}

class GreaterThanNow extends SyncRule {
    validateSync(params) {
        return params.value.getTime() > Date.now();
    }

    static ruleName() {
        return 'date.greaterThanNow';
    }
}

module.exports = [DateValidator, GreaterThanNow];
