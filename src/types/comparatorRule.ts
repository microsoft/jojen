import { Rule } from './Rule';

/**
 * The ComparatorRule is a type of rule whose main function is comparing
 * two values. It has a comparator function (by default strict equality)
 * which can be overridden.
 */
export abstract class ComparatorRule extends Rule {
    private cmps: ((a: any, b: any) => boolean)[] = [(a, b) => a === b];

    /**
     * Adds a comparator function to use for comparing the two values.
     */
    public addComparator(fn: ((a: any, b: any) => boolean)) {
        this.cmps.push(fn);
    }

    /**
     * Compares `a` and `b`, returning true if they're equal. This loops
     * through all comparators we have and returns true if ANY of them
     * return true.
     */
    public compare(a: any, b: any) {
        for (let i = 0; i < this.cmps.length; i++) {
            if (this.cmps[i](a, b)) {
                return true;
            }
        }

        return false;
    }
}
