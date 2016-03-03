import Rule from './rule';

/**
 * The ComparatorRule is a type of rule whose main function is comparing
 * two values. It has a comparator function (by default strict equality)
 * which can be overridden.
 */
export default class ComparatorRule extends Rule {
    constructor() {
        super();
        this._cmps = [(a, b) => a === b];
    }

    /**
     * Adds a comparator function to use for comparing the two values.
     * @param {Function} fn
     */
    addComparator(fn) {
        this._cmps.push(fn);
    }

    /**
     * Compares `a` and `b`, returning true if they're equal. This loops
     * through all comparators we have and returns true if ANY of them
     * return true.
     *
     * @param  {*} a
     * @param  {*} b
     * @return {Boolean}
     */
    compare(a, b) {
        for (let i = 0; i < this._cmps.length; i++) {
            if (this._cmps[i](a, b)) {
                return true;
            }
        }

        return false;
    }
}
