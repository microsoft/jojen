describe('any', () => {
    it('works for any values', () => {
        expect((Jo) => Jo.any()).not.to.failOn(undefined);
        expect((Jo) => Jo.any()).not.to.failOn(null);
        expect((Jo) => Jo.any()).not.to.failOn('fubar');
    });

    it('takes optional values', () => {
        expect((Jo) => Jo.optional()).not.to.failOn(undefined);
        expect((Jo) => Jo.optional()).not.to.failOn(null);
        expect((Jo) => Jo.optional()).not.to.failOn('fubar');
    });

    it('requires values correctly', () => {
        expect((Jo) => Jo.required()).to.failOn(undefined, [
            {
                context: { key: 'value' },
                message: '"value" is required.',
                path: 'value',
                type: 'required'
            }
        ]);

        expect((Jo) => Jo.required()).not.to.failOn(null);
        expect((Jo) => Jo.required()).not.to.failOn('fubar');
    });


    it('disallows forbidden values', () => {
        expect((Jo) => Jo.forbidden()).not.to.failOn(undefined);
        expect((Jo) => Jo.forbidden()).to.failOn(null);
        expect((Jo) => Jo.forbidden()).to.failOn('fubar');
    });

    it('allows valid values', () => {
        expect((Jo) => Jo.valid('a')).to.failOn('c');
        expect((Jo) => Jo.valid('a')).not.to.failOn('a');

        expect((Jo) => Jo.valid('a', 'b')).not.to.failOn('a');
        expect((Jo) => Jo.valid('a', 'b')).not.to.failOn('b');
        expect((Jo) => Jo.valid('a', 'b')).to.failOn('c');

        expect((Jo) => Jo.valid(['a', 'b'])).not.to.failOn('a');
        expect((Jo) => Jo.valid(['a', 'b'])).not.to.failOn('b');
        expect((Jo) => Jo.valid(['a', 'b'])).to.failOn('c');

        expect((Jo) => Jo.valid('a').valid('b')).not.to.failOn('a');
    });

    it('disallows invalid values', () => {
        expect((Jo) => Jo.invalid('a')).not.to.failOn('c');
        expect((Jo) => Jo.invalid('a')).to.failOn('a');

        expect((Jo) => Jo.invalid('a', 'b')).to.failOn('a');
        expect((Jo) => Jo.invalid('a', 'b')).to.failOn('b');
        expect((Jo) => Jo.invalid('a', 'b')).not.to.failOn('c');

        expect((Jo) => Jo.invalid(['a', 'b'])).to.failOn('a');
        expect((Jo) => Jo.invalid(['a', 'b'])).to.failOn('b');
        expect((Jo) => Jo.invalid(['a', 'b'])).not.to.failOn('c');
    });

    it('allows allowed values', () => {
        expect((Jo) => Jo.allow('a')).to.failOn('c');
        expect((Jo) => Jo.allow('a')).not.to.failOn('a');

        expect((Jo) => Jo.allow('a', 'b')).not.to.failOn('a');
        expect((Jo) => Jo.allow('a', 'b')).not.to.failOn('b');
        expect((Jo) => Jo.allow('a', 'b')).to.failOn('c');

        expect((Jo) => Jo.allow(['a', 'b'])).not.to.failOn('a');
        expect((Jo) => Jo.allow(['a', 'b'])).not.to.failOn('b');
        expect((Jo) => Jo.allow(['a', 'b'])).to.failOn('c');

        expect((Jo) => Jo.allow('a').allow('b')).to.failOn('a');

        expect((Jo) => Jo.allow(1).string()).not.to.failOn(1);
    });
});
