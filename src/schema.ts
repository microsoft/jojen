import Rule from './types/rule';
import RuleSet from './ruleset';

/**
 * The Schema is an immutable object used for building definitions
 * that objects can be validated against. It provides methods that can be
 * chained and combined in order to create validations. See the docs on
 * the Ruleset class for calling conventions. On each validation call,
 * a new Schema is created and returned in the new rule's context.
 */
export class Schema {
    private compiled: boolean = false;

    constructor(ruleset: RuleSet, generators = []) {
        this._generators = generators;
        this._rules = null; // filled on compile

        ruleset.buildChain(this, (method, child, args) => {
            const Node = child.node();
            const newGens = generators.concat([(list) => this._build(Node, args, list)]);
            return new Schema(child, newGens);
        });
    }

    /**
     * Creates an instance of the Rule (Node) with the provided arguments
     * and adds it to the list. This does not run compile on the node,
     * just instantiates it without side effects.
     *
     * @param  {Fucntion} Node
     * @param  {Array} args
     * @param  {[]Rule} rules
     * @return {[]Rule}
     */
    private _build(Node, args, list) {
        if (Node === null) return list;

        const node = new Node();
        node._setParams.apply(node, args);

        return list.concat(node);
    }

    /**
     * Compiles the generators in this schema to a list of rules. De-duplicates
     * the rule set and removes rules that don't operate.
     * @return {[]Rule}
     */
    private _compile() {
        // Stable sort the rules so that higher-priority rules come first.
        // We implement this as a stable sort by comparing equal-priority
        // rules by their position.
        const rules = this._generators.reduce((list, gen) => gen(list), []);

        rules.sort((a, b) => {
            const priority = a.priority() - b.priority();
            const position = rules.indexOf(a) - rules.indexOf(b);
            return priority || position;
        });

        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            rule.compile(new RuleParams(rule, rules));

            if (!rule.operates()) {
                rules.splice(i, 1);
                i--;
                continue;
            }

            for (let k = 0; k < i; k++) {
                if (rule.identicalTo(rules[k])) {
                    rules.splice(k, 1);
                    k--;
                    i--;
                }
            }
        }

        return rules;
    }

    /**
     * Gets a list of rules for this schema.
     * @return {Schema}
     */
    public getRules() {
        if (!this.compiled) {
            this._rules = this._compile();
            this.compiled = true;
        }

        return this._rules;
    }
}
