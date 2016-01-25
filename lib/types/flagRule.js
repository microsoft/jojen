import Rule from './rule';

/**
 * A non-operational rule that invokes a method on the closest previous rule.
 */
export default class FlagRule extends Rule {
    operates() {
        return false;
    }

    /**
     * Should be called by implementations of FlagRule.compile(). Looks
     * for the closest rule of `Type`, and calls the function on it.
     * @param {Function} Type
     * @param {Function} fn
     * @param {*} ...args
     * @return {Boolean} whether such a rule was found
     */
    invokeLast(params, Type, fn) {
        for (let i = params.rules.length - 1; i >= 0; i--) {
            if (params.rules[i] instanceof Type) {
                fn(params.rules[i]);
                return true;
            }
        }

        return false;
    }

    /**
     * Similar to invokeLast, but finds the furthest rule of `Type` to call on.
     * @param {Function} Type
     * @param {Function} fn
     * @param {*} ...args
     * @return {Boolean} whether such a rule was found
     */
    invokeFirst(params, Type, fn) {
        for (let i = 0; i < params.rules.length; i--) {
            if (params.rules[i] instanceof Type) {
                fn(params.rules[i]);
                return true;
            }
        }

        return false;
    }
}
