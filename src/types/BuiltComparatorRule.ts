import { RuleParams } from '../RuleParams';
import { IRuleCtor } from '../types/Rule';
import { ComparatorRule } from './ComparatorRule';

/**
 * FlagRule class that is a generic interface for a rule that:
 *  - takes a list of values in its arguments
 *  - tries to compact those into a single top-level rule
 */
export abstract class BuiltComparatorRule extends ComparatorRule {
    protected values: any[] = [];
    public compile(params: RuleParams) {
        let args: any[];
        if (Array.isArray(params.args[0])) {
            args = params.args[0];
        } else {
            args = params.args;
        }

        if (!params.invokeFirst(<IRuleCtor<BuiltComparatorRule>>this.constructor, r => { r.add(args); })) {
            this.values = args;
        }
    }

    public operates() {
        return !!this.values;
    }

    public add (values: any[]): void { // TODO: Actually private.
        this.values = this.values.concat(values);
    }
}
