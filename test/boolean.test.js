describe('boolean', () => {
    it('will only validate booleans', () => {
        expect(Jo => Jo.boolean()).to.not.failOn(1);
        expect(Jo => Jo.boolean()).to.not.failOn(0);
        expect(Jo => Jo.boolean()).to.not.failOn('true');
        expect(Jo => Jo.boolean()).to.not.failOn('false');
        expect(Jo => Jo.boolean()).to.not.failOn(false);
        expect(Jo => Jo.boolean()).to.not.failOn(true);
    });
});
