describe('object', () => {
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
    });
});
