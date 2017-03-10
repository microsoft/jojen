import { IRuleValidationParams } from '../types/rule';
import { SyncRule } from '../types/syncRule';

// tslint:disable-next-line
const strictISO = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/;

export class DateValidator extends SyncRule {
    public coerce(value: any): Date {
        if (typeof value === 'string' && strictISO.test(value)) {
            return new Date(value);
        }
        return undefined;
    }

    public validateSync(params: IRuleValidationParams<any>): boolean  {
        return params.value instanceof Date;
    }

    public static ruleName(): string {
        return 'date';
    }
}

export class GreaterThanNow extends SyncRule {
    public validateSync(params: IRuleValidationParams<Date>): boolean {
        return params.value.getTime() > Date.now();
    }

    public static ruleName(): string {
        return 'date.greaterThanNow';
    }
}
