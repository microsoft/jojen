describe('any', () => {
    it('works for any values', () => {
        expect(Jo.any()).not.to.failOn(undefined);
        expect(Jo.any()).not.to.failOn(null);
        expect(Jo.any()).not.to.failOn('fubar');
    });

    it('requires values correctly', () => {
        expect(Jo.required()).to.failOn(undefined);
        expect(Jo.required()).not.to.failOn(null);
        expect(Jo.required()).not.to.failOn('fubar');
    });
});
