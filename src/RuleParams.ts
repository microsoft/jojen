import {
    IRuleCtor,
    Rule,
} from './types/rule';

export class RuleParams {
    private index: number;
    public readonly args: any[];

    constructor(rule: Rule, private rules: Rule[]) {
        this.index = rules.indexOf(rule);
        this.args = rule.params;
    }

    /**
     * Looks for the closest rule of `Type`, and calls the function on it.
     */
    public invokeLast<T extends Rule>(type: IRuleCtor<T>, fn: (rule: T) => void): boolean {
        for (let i = this.index - 1; i >= 0; i--) {
            if (this.rules[i] instanceof <any>type) {
                fn(<T>this.rules[i]);
                return true;
            }
        }

        return false;
    }

    /**
     * Similar to invokeLast, but finds the furthest rule of `Type` to call on.
     */
    public invokeFirst<T extends Rule>(type: IRuleCtor<T>, fn: (rule: T) => void): boolean {
        for (let i = 0; i < this.index; i++) {
            if (this.rules[i] instanceof <any>type) {
                fn(<T>this.rules[i]);
                return true;
            }
        }

        return false;
    }

    /**
     * Similar to invokeLast/First, but invokes the function on all `Type`.
     */
    public invokeAll<T extends Rule>(type: IRuleCtor<T>, fn: (rule: T) => void): boolean {
        let found = false;
        for (let i = 0; i < this.rules.length; i++) {
            if (this.rules[i] instanceof <any>type) {
                fn(<T>this.rules[i]);
                found = true;
            }
        }

        return found;
    }
}
