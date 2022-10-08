class RuleParams {
    constructor(rule, rules) {
        this._rule = rule;

        this.index = rules.indexOf(rule);
        this.rules = rules;
        this.args = rule._params;
    }

    /**
     * Looks for the closest rule of `Type`, and calls the function on it.
     * @param {Function} Type
     * @param {Function} fn
     * @param {*} ...args
     * @return {Boolean} whether such a rule was found
     */
    invokeLast(Type, fn) {
        for (let i = this.index - 1; i >= 0; i--) {
            if (this.rules[i] instanceof Type) {
                fn(this.rules[i]);
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
    invokeFirst(Type, fn) {
        for (let i = 0; i < this.index; i++) {
            if (this.rules[i] instanceof Type) {
                fn(this.rules[i]);
                return true;
            }
        }

        return false;
    }

    /**
     * Similar to invokeLast/First, but invokes the function on all `Type`.
     * @param {Function} Type
     * @param {Function} fn
     * @param {*} ...args
     * @return {Boolean} whether such a rule was found
     */
    invokeAll(Type, fn) {
        let found = false;
        for (let i = 0; i < this.rules.length; i++) {
            if (this.rules[i] instanceof Type) {
                fn(this.rules[i]);
                found = true;
            }
        }

        return found;
    }
}

/**
 * The Schema is an immutable object used for building definitions
 * that objects can be validated against. It provides methods that can be
 * chained and combined in order to create validations. See the docs on
 * the Ruleset class for calling conventions. On each validation call,
 * a new Schema is created and returned in the new rule's context.
 */
export default class Schema {
    constructor(ruleset, generators = []) {
        this._generators = generators;
        this._compiled = false;
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
     * @param  {Function} Node
     * @param  {Array} args
     * @param  {[]Rule} rules
     * @return {[]Rule}
     */
    _build(Node, args, list) {
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
    _compile() {
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
    getRules() {
        if (!this._compiled) {
            this._rules = this._compile();
            this._compiled = true;
        }

        return this._rules;
    }
}
