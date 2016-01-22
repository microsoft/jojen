describe('any', () => {
    it('works for any values', () => {
        expect(Jo.validate(undefined, Jo.any())).not.to.fail;
        expect(Jo.validate(null, Jo.any())).not.to.fail;
        expect(Jo.validate('fubar', Jo.any())).not.to.fail;
    });

    it('requires values correctly', () => {
        expect(Jo.validate(undefined, Jo.any())).to.fail;
        expect(Jo.validate(null, Jo.any())).not.to.fail;
        expect(Jo.validate('fubar', Jo.any())).not.to.fail;
    });
});
