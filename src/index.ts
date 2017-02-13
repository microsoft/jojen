import { english } from './lang/en';
import { Schema } from './Schema';
import { ILanguagePack, IValidationOptions, IValidationResult, Validator } from './validator';

export interface IGlobalJo {
    (): Validator;
    validate(value: any, schema: Schema, options: IValidationOptions, callback: (err: Error, val?: any) => void): void;
    validateSync<T>(value: T, schema: Schema, options?: IValidationOptions): IValidationResult<T>;
    assert<T>(value: any, schema: Schema, message: string | Error): T;
    load(language: ILanguagePack): this;
}

// Default validator for Joi compatibility, so we can call methods like
// Jo.any(). More advanced users will want to subclass this.
const defaultValidator = new Validator();
defaultValidator.load(english);

export const jo: IGlobalJo = <any>(() => new Validator());
jo.validate = defaultValidator.validate.bind(defaultValidator);
jo.validateSync = defaultValidator.validateSync.bind(defaultValidator);
jo.assert = defaultValidator.assert.bind(defaultValidator);
jo.load = defaultValidator.load.bind(defaultValidator);

// TODO: Handle the other stuff

