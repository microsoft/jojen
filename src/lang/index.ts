export { english } from './en';

export interface ILanguage {
    [prop: string]: (opts: any) => string;
}
