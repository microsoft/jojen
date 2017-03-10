import { SyncRule } from '../types/syncRule';
import { IRuleValidationParams } from '../types/rule';

const strictISO = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/;

export class DateValidator extends SyncRule {
    coerce(value: any): Date {
        if (typeof value === 'string' && strictISO.test(value)) {
            return new Date(value);
        }
        return undefined;
    }

    validateSync(params: IRuleValidationParams<any>): boolean  {
        return params.value instanceof Date;
    }

    static ruleName(): string {
        return 'date';
    }
}

export class GreaterThanNow extends SyncRule {
    validateSync(params: IRuleValidationParams<Date>): boolean {
        return params.value.getTime() > Date.now();
    }

    static ruleName(): string {
        return 'date.greaterThanNow';
    }
}
