import { Schema } from './Schema';

export interface IAnySchema extends Schema {
    optional(): IAnySchema;
    required(): IAnySchema;
    valid(...args: any[]): IAnySchema;
    invalid(...args: any[]): IAnySchema;
    forbidden(): IAnySchema;
    allow(...args: any[]): IAnySchema;
    custom(fn: (err?: Error, data?: any) => void): IAnySchema;
    default(val: any): IAnySchema;
}

export interface IAlternativesSchema extends IAnySchema {
    try (schemas: Schema[]): IAlternativesSchema;
}

export interface IArraySchema extends IAnySchema  {
    sparse(allowSparse?: boolean): IArraySchema;
    single(allowSingle?: boolean): IArraySchema;
    items(schema: Schema): IArraySchema;
    ordered(): IArraySchema;
    min(min: number): IArraySchema;
    max(max: number): IArraySchema;
    length(length: number): IArraySchema;
    unique(): IArraySchema;
    unique(prop: string): IArraySchema;
    unique(comp: (a: any, b: any) => boolean): IArraySchema;
}

// tslint:disable-next-line
export interface IBooleanSchema extends IAnySchema {}

export interface IDateSchema extends IAnySchema {
    greaterThanNow(): IDateSchema;
}

export interface IFunctionSchema extends IAnySchema {
    arity(arity: number): IFunctionSchema;
    minArity(min: number): IFunctionSchema;
    maxArity(max: number): IFunctionSchema;
}

export interface INumberSchema extends IAnySchema {
    integer(): INumberSchema;
    min(min: number): INumberSchema;
    max(max: number): INumberSchema;
    greater(lowerBound: number): INumberSchema;
    less(upperBound: number): INumberSchema;
    negative(): INumberSchema;
    positive(): INumberSchema;
    multiple(factor: number): INumberSchema;
    precision(precision: number): INumberSchema;
}

export interface IObjectSchema extends IAnySchema {
    keys(schemas: { [key: string]: Schema }): IObjectSchema;
    pattern(pattern: string | RegExp, schema: Schema): IObjectSchema;
    unknown(allowUnknown?: boolean): IObjectSchema;
}

export interface IStringSchema extends IAnySchema {
    insensitive(): IStringSchema;
    min(min: number): IStringSchema;
    max(max: number): IStringSchema;
    length(length: number): IStringSchema;
    creditCard(): IStringSchema;
    regex(regEx: RegExp): IStringSchema;
    alphanum(): IStringSchema;
    token(): IStringSchema;
    email(): IStringSchema;
    ip(options?: {
        version?: ('ipv4' | 'ipv6')[],
        cidr?: 'required' | 'optional',
    }): IStringSchema;
    uri(options?: {
        allowRelative?: boolean,
    }): IStringSchema;
    guid(): IStringSchema;
    hex(): IStringSchema;
    hostname(): IStringSchema;
    lowercase(): IStringSchema;
    uppercase(): IStringSchema;
    trim(): IStringSchema;
}

export interface IMainSchema extends IAnySchema {
    alternatives(): IAlternativesSchema;
    array(): IArraySchema;
    boolean(): IBooleanSchema;
    date(): IDateSchema;
    function(): IFunctionSchema;
    number(): INumberSchema;
    object(): IObjectSchema;
    string(): IStringSchema;
}
