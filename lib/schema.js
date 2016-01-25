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
            return new Schema(child, this._compile(Node, args, rules));
        });
    }

    _compile(Node, args, rules) {
        const out = rules.slice();
        if (Node === null) return out;

        const node = new Node();
        node.compile.call(node, { args, rules });
        node._setParams.apply(node, args);

        return out.concat([node]);
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
            const rule = this._rules[i];
            if (!rule.operates()) {
                this._rules.splice(i, 1);
                continue;
            }

            for (let k = i + 1; k < this._rules.length; k++) {
                if (rule.identicalTo(this._rules[k])) {
                    this._rules.splice(k, 1);
                    k--;
                }
            }
        }

        return this;
    }
}
