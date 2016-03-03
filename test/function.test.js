describe('function', () => {
    it('will only validate functions', () => {
        expect(Jo => Jo.func()).to.failOn('function() { console.log("yea!") }');
        expect(Jo => Jo.func()).to.failOn(null);
        expect(Jo => Jo.func()).to.not.failOn(() => {});
        expect(Jo => Jo.func()).to.not.failOn(function () {}); // eslint-disable-line prefer-arrow-callback, max-len
        expect(Jo => Jo.func()).to.not.failOn(Math.abs);
        expect(Jo => Jo.func()).to.not.failOn(new Function()); // eslint-disable-line no-new-func
    });

    it('checks arity', () => {
        expect(Jo => Jo.func().arity(1)).to.failOn((a, b) => {}); // eslint-disable-line no-unused-vars, max-len
        expect(Jo => Jo.func().arity(2)).to.not.failOn((a, b) => {}); // eslint-disable-line no-unused-vars, max-len
        expect(Jo => Jo.func().arity(0)).to.not.failOn(() => {});
    });

    it('checks min arity', () => {
        expect(Jo => Jo.func().minArity(2)).to.failOn(() => {});
        expect(Jo => Jo.func().minArity(2)).to.not.failOn((a, b) => {}); // eslint-disable-line no-unused-vars, max-len
        expect(Jo => Jo.func().minArity(2)).to.not.failOn((a, b, c) => {}); // eslint-disable-line no-unused-vars, max-len
    });

    it('checks max arity', () => {
        expect(Jo => Jo.func().maxArity(2)).to.not.failOn(() => {});
        expect(Jo => Jo.func().maxArity(2)).to.not.failOn((a, b) => {}); // eslint-disable-line no-unused-vars, max-len
        expect(Jo => Jo.func().maxArity(2)).to.failOn((a, b, c) => {}); // eslint-disable-line no-unused-vars, max-len
    });
});
