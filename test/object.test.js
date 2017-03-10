import Jo from '../lib';

describe('object', () => {
    it('validates types', () => {
        expect(Jo => Jo.object()).not.to.failOn({});
        expect(Jo => Jo.object()).to.failOn(null);
        expect(Jo => Jo.object()).to.failOn(42);
        expect(Jo => Jo.object()).to.failOn('nope');
    });

    describe('keys', () => {
        it('restricts unknown', () => {
            expect((Jo) => Jo.object().keys({ a: Jo.any() })).to.failOn({ b: 42 }, [
                {
                    context: { key: 'value' },
                    message: '"value" should not have "b".',
                    path: 'value',
                    type: 'object.unknown'
                }
            ]);
        });

        it('allows unknown when flagged', () => {
            expect((Jo) => Jo.object().keys({ a: Jo.any() }).unknown()).not.to.failOn({ b: 42 });
        });

        it('runs subvalidations', () => {
            // todo after we have validators we can test this on
        });

        it('Handles overrides correctly', () => {
            expect(Jo => Jo.object().keys({ a: Jo.any() }).keys({ b: Jo.any() })).not.to.failOn({
                a: 42,
                b: 42,
            });

            expect(Jo =>
                Jo.object()
                .keys({
                    a: Jo.any(),
                }).unknown()
                .keys({
                    b: Jo.any(),
                })
            ).to.not.failOn({
                c: 42,
            });
        });

        it('converts nested parameters', () => {
            Jo.validate(
                { a: '42' },
                Jo.object().keys({ a: Jo.number() }),
                (err, value) => {
                    expect(err).to.be.null;
                    expect(value).to.deep.equal({ a: 42 });
                }
            );
        });

        it('does not add parameters which are optional', () => {
            Jo.validate(
                {},
                Jo.object().keys({ a: Jo.number() }),
                (err, value) => {
                    expect(err).to.be.null;
                    expect(value).to.not.have.keys('a');
                }
            );
        });

        it('Does not share overrides', () => {
            expect(Jo => {
                const base = Jo.object().keys({ b: Jo.any().optional() });
                const a = base.keys({ a: Jo.number().max(4) });
                const b = base.keys({ a: Jo.number().max(3) });
                a.getRules();
                b.getRules();
                return a;
            })
            .not.to.failOn({
                a: 4,
            }, {
                joi: false,
            });
        });
    });

    describe('pattern', () => {
        it('validates unknown keys using a pattern', () => {
            expect(Jo => Jo.object().pattern(/\d+/, Jo.number())).to.failOn({ b: 42 });
            expect(Jo => Jo.object().pattern(/\w+/, Jo.number())).to.not.failOn({ b: 42 });
        });

        it('validates values using a pattern', () => {
            expect(Jo => Jo.object().pattern(/\w+/, Jo.number())).to.failOn({ b: 'string' });
            expect(Jo => Jo.object().pattern(/\w+/, Jo.number())).to.not.failOn({ b: 42 });
        });

        it('converts parameters', () => {
            Jo.validate(
                { a: '42' },
                Jo.object().pattern(/\w+/, Jo.number()),
                (err, value) => {
                    expect(err).to.be.null;
                    expect(value).to.deep.equal({ a: 42 });
                }
            );
        });
    });
});
