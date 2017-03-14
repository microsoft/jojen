import { IRuleValidationParams, Rule } from './types/Rule';
import { assign, pick } from './util';

export interface IStackTraceCapturer {
    captureStackTrace (self: Error): void;
}
function isCapturer (errorCtor: any): errorCtor is IStackTraceCapturer {
    return 'captureStackTrace' in errorCtor;
}

export class ValidationError extends Error {
    public readonly isJoi: boolean = true; // shh! They'll never find us!
    public readonly name = 'ValidationError';
    private opts: {
        key: string;
        rule: string;
        ruleParams: any[];
    } & IRuleValidationParams<any, void>;
    public details: {
        message?: string;
        path: string;
        type: string;
        context: {
            key: string;
        }
    }[];

    constructor (rule: Rule, params: IRuleValidationParams<any, void>, info: {}) {
        super();
        const key = params.path[params.path.length - 1];
        const opts = assign(
            {
                key,
                rule: rule.name(),
                ruleParams: rule.params,
            },
            params,
            info,
        );

        this.opts = opts;

        this.details = [{
            path: opts.path.join('.'),
            type: opts.rule,
            context: { key },
            message: rule.getErrorMessage(params),
        }];
    }

    /**
     * Combines the details of this error with another, returning the current
     * (now mutated) error.
     */
    public union (err: ValidationError): this {
        this.details = this.details.concat(err.details);
        return this;
    }

    /**
     * Returns a subset of attributes for representation as JSON.
     */
    public toJSON (): Object {
        const obj = pick(this, ['isJoi', 'name', 'details']);
        if (this.message) {
            obj.message = this.message;
        }

        return obj;
    }

    /**
     * Captures and attaches a stack trace to the error.
     */
    public addStackTrace (): void {
        if (isCapturer(Error)) {
            Error.captureStackTrace(this);
        } else {
            // workaround for conflicting typings
            this.stack = new (<any>Error)().stack;
        }
    }

    /**
     * Converts the validation error to a JSON string.
     */
    public toString (): string {
        return JSON.stringify(this.toJSON(), null, 2);
    }
}
