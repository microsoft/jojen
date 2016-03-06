describe('boolean', () => {
    it('will only validate booleans', () => {
        expect(Jo => Jo.boolean()).to.failOn(1);
        expect(Jo => Jo.boolean()).to.failOn(0);
        expect(Jo => Jo.boolean()).to.failOn('true', { ignoreCompability: true });
        expect(Jo => Jo.boolean()).to.not.failOn(false);
        expect(Jo => Jo.boolean()).to.not.failOn(true);
    });
});
