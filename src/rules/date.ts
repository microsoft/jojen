import { IRuleValidationParams } from '../types/Rule';
import { SyncRule } from '../types/SyncRule';

// tslint:disable-next-line
const strictISO = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/;

export class DateValidator extends SyncRule {
    public coerce(value: any): Date {
        if (typeof value === 'string' && strictISO.test(value)) {
            return new Date(value);
        }
        return undefined;
    }

    public validateSync(params: IRuleValidationParams<any, void>): boolean  {
        return params.value instanceof Date;
    }

    public static ruleName(): string {
        return 'date';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return  `"${params.key}" must be an iso date.`;
    }
}

export class GreaterThanNow extends SyncRule {
    public validateSync(params: IRuleValidationParams<Date, void>): boolean {
        return params.value.getTime() > Date.now();
    }

    public static ruleName(): string {
        return 'date.greaterThanNow';
    }

    public getErrorMessage(params: IRuleValidationParams<any, void>): string {
        return `"${params.key}" must be a date in the future.`;
    }
}
