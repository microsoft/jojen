import { ILanguage } from './lang';
import { Rule, IRuleValidationParams } from './types/rule';
import { assign, pick } from './util';

/**
 * Object passed to language definitions to spit out a pretty message.
 * @typedef {Object} ValidationLanguageOptions
 * @param {String} key - the key of the value that failed validation
 * @param {Object} params - original params object the rule was created with
 * @param {*} value - the object under validation
 * @param {*} info - optional additional info returned from the validation rule
 */

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
        rule: string;
        ruleParams: any[];
    };
    public details: {
        message?: string;
        path: string;
        type: string;
        context: {
            key: string;
        }
    }[];

    constructor (rule: Rule, params: IRuleValidationParams<any>, info) {
        super();
        const opts = assign({}, params, {
            rule: rule.name(),
            ruleParams: rule.params,
        }, info);
        const key = opts.path[opts.path.length - 1];

        this.opts = opts;
        this.opts.key = key;

        this.details = [{
            path: opts.path.join('.'),
            type: opts.rule,
            context: { key },
        }];
    }

    /**
     * Attaches the error to a language definition in
     * order to fill out its details.
     * @param  {Object} language
     */
    public attach (language: ILanguage) {
        if (!language) {
            return;
        }

        for (let i = 0; i < this.details.length; i++) {
            const detail = this.details[i];
            if (!language.hasOwnProperty(detail.type)) {
                continue;
            }

            detail.message = language[detail.type](this.opts);
        }
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
            this.stack = (new Error()).stack;
        }
    }

    /**
     * Converts the validation error to a JSON string.
     * @return {String}
     */
    public toString (): string {
        return JSON.stringify(this.toJSON(), null, 2);
    }
}
