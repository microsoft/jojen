describe('alternatives', () => {
    it('Validates with an array', () => {
        expect(Jo => Jo.alternatives([Jo.number(), Jo.string()])).to.not.failOn(1);
        expect(Jo => Jo.alternatives([Jo.number(), Jo.string()])).to.not.failOn('test');
        expect(Jo => Jo.alternatives([Jo.number(), Jo.string()])).to.failOn(true);
    });

    it('.try injects additional', () => {
        expect(Jo => Jo.alternatives().try(Jo.number())).to.not.failOn(1);
        expect(Jo => Jo.alternatives([Jo.number()]).try(Jo.string())).to.not.failOn('test');
    });
});
