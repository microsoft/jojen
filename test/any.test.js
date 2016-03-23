import globalJo from '../lib';

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
        expect((Jo) => Jo.optional().valid(1)).to.not.failOn(1);
        expect((Jo) => Jo.optional().valid(1)).to.failOn(2);
    });

    it('requires values correctly', () => {
        expect((Jo) => Jo.required()).to.failOn(undefined, [
            {
                context: { key: 'value' },
                message: '"value" is required.',
                path: 'value',
                type: 'required',
            },
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
        expect((Jo) => Jo.allow('a')).to.not.failOn('c');
        expect((Jo) => Jo.string().allow(1)).not.to.failOn(1);
        expect((Jo) => Jo.string().allow(1).allow(2)).not.to.failOn(1);
        expect((Jo) => Jo.string().allow(1).allow(2)).not.to.failOn(2);
    });

    it('aborts further validations on unrequired values', () => {
        expect(Jo => Jo.string().max(3)).not.to.failOn(undefined);
        expect(Jo => Jo.string().max(3).required()).to.failOn(undefined);
    });

    it('allows custom validators', () => {
        const opts = { joi: false };
        expect(Jo => Jo.custom((val, cb) => {
            cb(undefined, val === 1);
        })).to.not.failOn(1, opts);
        expect(Jo => Jo.custom((val, cb) => {
            setImmediate(() => cb(undefined, val === 1));
        })).to.not.failOn(1, opts);
        expect(Jo => Jo.custom((val, cb) => {
            setImmediate(() => cb({
                expected: 'whatever',
            }));
        })).to.failOn(0, {
            joi: false,
        });
        expect(Jo => Jo.custom(() => {
            throw new Error('BAD!');
        })).to.failOn(0, {
            joi: false,
        });
    });

    describe('default', () => {
        it('is used in validation', () => {
            expect(Jo => Jo.number().integer().default(1)).to.not.failOn(undefined);
            expect(Jo => Jo.number().integer().default(0)).to.not.failOn(undefined);
            expect(Jo => Jo.number().integer().default(1)).to.failOn('test');
        });

        it('is included in the validation result', () => {
            const res = globalJo.assert(undefined, globalJo.default(1));
            expect(res).to.equal(1);
        });

        it('is included in the validation result with complex type', () => {
            const def = {
                test: 1,
            };

            const res = globalJo.assert(undefined, globalJo.default(def));
            expect(res).to.eql(def);
        });
    });
});
