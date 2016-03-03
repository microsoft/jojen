/**
 * The Schema is an immutable object used for building definitions
 * that objects can be validated against. It provides methods that can be
 * chained and combined in order to create validations. See the docs on
 * the Ruleset class for calling conventions. On each validation call,
 * a new Schema is created and returned in the new rule's context.
 */
export default class Schema {
    constructor(ruleset, rules = []) {
        this._rules = rules.slice();
        this._optimized = false;

        ruleset.buildChain(this, (method, child, args) => {
            if (this._optimized) {
                throw new Error('You cannot modify schemas after you start validating them.');
            }

            const Node = child.node();
            return new Schema(child, this._build(Node, args, rules));
        });
    }

    _build(Node, args, rules) {
        const out = rules.slice();
        if (Node === null) return out;

        const node = new Node();
        node._setParams.apply(node, args);

        return out.concat([node]);
    }

    /**
     * Optimizes the schema by deduplicating and reordering rules. This
     * is called the first time the schema is validated, and afterwards
     * the schema is NOT safe to fork.
     * @return {Schema}
     */
    _optimize() {
        if (this._optimized) {
            return this;
        }
        this._optimized = true;

        // Stable sort the rules so that higher-priority rules come first.
        // We implement this as a stable sort by comparing equal-priority
        // rules by their position.
        const rules = this._rules.slice().sort((a, b) => {
            const priority = a.priority() - b.priority();
            const position = this._rules.indexOf(a) - this._rules.indexOf(b);
            return priority || position;
        });

        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            rule.compile({
                rules,
                args: rule._params,
                index: i,
            });

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

        this._rules = rules;

        return this;
    }
}
