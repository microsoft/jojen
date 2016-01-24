import Rule from './rule';

/**
 * The CompiledRule uses a precompiled function (built on the .compile()
 * call) to run against the input.
 */
export default class CompiledRule extends Rule {

    /**
     * Returns a string for a function that will be called with the same
     * signature and arguments as #Validator.validate.
     * @return {String}
     * @example
     *   getFn() {
     *     return `if (params.value === 42) {
     *       return callback(this.error(params));
     *     }`;
     *   }
     */
    getFn() {
        throw new Error('not implemented');
    }

    compile() {
        const fn = this.getFn.apply(this, arguments);
        this.validate = new Function('params', 'callback', fn); //eslint-disable-line
    }
}
