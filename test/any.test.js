describe('any', () => {
    it('works for any values', () => {
        expect(Jo.any()).not.to.failOn(undefined);
        expect(Jo.any()).not.to.failOn(null);
        expect(Jo.any()).not.to.failOn('fubar');
    });

    it('takes optional values', () => {
        expect(Jo.optional()).not.to.failOn(undefined);
        expect(Jo.optional()).not.to.failOn(null);
        expect(Jo.optional()).not.to.failOn('fubar');
    });

    it('requires values correctly', () => {
        expect(Jo.required()).to.failOn(undefined);
        expect(Jo.required()).not.to.failOn(null);
        expect(Jo.required()).not.to.failOn('fubar');
    });


    it('disallows forbidden values', () => {
        expect(Jo.forbidden()).not.to.failOn(undefined);
        expect(Jo.forbidden()).to.failOn(null);
        expect(Jo.forbidden()).to.failOn('fubar');
    });

    it('allows allowed values', () => {
        expect(Jo.allow('a')).to.failOn('c');
        expect(Jo.allow('a')).not.to.failOn('a');

        expect(Jo.allow('a', 'b')).not.to.failOn('a');
        expect(Jo.allow('a', 'b')).not.to.failOn('b');
        expect(Jo.allow('a', 'b')).to.failOn('c');

        expect(Jo.allow(['a', 'b'])).not.to.failOn('a');
        expect(Jo.allow(['a', 'b'])).not.to.failOn('b');
        expect(Jo.allow(['a', 'b'])).to.failOn('c');

        expect(Jo.allow('a').allow('b')).not.to.failOn('a');
        expect(Jo.allow('a').allow('b')).not.to.failOn('b');
        expect(Jo.allow('a').allow('b')).to.failOn('c');
    });

    it('allows valid values', () => {
        expect(Jo.valid('a')).to.failOn('c');
        expect(Jo.valid('a')).not.to.failOn('a');

        expect(Jo.valid('a', 'b')).not.to.failOn('a');
        expect(Jo.valid('a', 'b')).not.to.failOn('b');
        expect(Jo.valid('a', 'b')).to.failOn('c');

        expect(Jo.valid(['a', 'b'])).not.to.failOn('a');
        expect(Jo.valid(['a', 'b'])).not.to.failOn('b');
        expect(Jo.valid(['a', 'b'])).to.failOn('c');

        expect(Jo.valid('a').valid('b')).to.failOn('a');
    });

    it('disallows invalid values', () => {
        expect(Jo.invalid('a')).not.to.failOn('c');
        expect(Jo.invalid('a')).to.failOn('a');

        expect(Jo.invalid('a', 'b')).to.failOn('a');
        expect(Jo.invalid('a', 'b')).to.failOn('b');
        expect(Jo.invalid('a', 'b')).not.to.failOn('c');

        expect(Jo.invalid(['a', 'b'])).to.failOn('a');
        expect(Jo.invalid(['a', 'b'])).to.failOn('b');
        expect(Jo.invalid(['a', 'b'])).not.to.failOn('c');
    });
});
