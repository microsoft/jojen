describe('any', () => {
    it('works for any values', () => {
        expect(Jo.validate(null, Jo.any())).not.to.fail;
    });
});
