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
            const Node = child.node();

            let newRules = rules;
            if (Node !== null) {
                const node = new Node();
                node.compile.apply(node, args);
                newRules = newRules.concat(node.hoist(), [ node ]);
            }

            return new Schema(child, newRules);
        });
    }

    /**
     * Optimizes the schema by deduplicating and reordering rules.
     * @return {Schema}
     */
    _optimize() {
        if (this._optimized) {
            return this;
        }

        this._optimized = true;
        for (let i = 0; i < this._rules.length; i++) {
            for (let k = i + 1; k < this._rules.length; k++) {
                if (this._rules[i].identicalTo(this._rules[k])) {
                    this._rules.splice(k, 1);
                    k--;
                }
            }
        }

        return this;
    }
}
