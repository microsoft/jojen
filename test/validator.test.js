import Jo from '../lib';

describe('validator', () => {
    describe('assert()', () => {
        it('throws jojen errors', () => {
            expect(() => {
                Jo.assert(undefined, Jo.required());
            }).to.throw(Error);
        });
        it('throws error with prefix', () => {
            expect(() => {
                Jo.assert(undefined, Jo.required(), 'sdkjghsiugd');
            }).to.throw(/sdkjghsiugd/);
        });
        it('throws does not throw on validation', () => {
            expect(() => {
                Jo.assert(1, Jo.required());
            }).not.to.throw();
        });
    });

    describe('validateSync()', () => {
        it('works for a sync rule', () => {
            expect(Jo.validateSync(1, Jo.number())).to.eql({
                value: 1,
                error: null,
            });
        });

        it('throws when a rule tries to validate async', () => {
            expect(() =>
                Jo.validateSync(1, Jo.custom((val, cb) => setImmediate(() => cb())))
            ).to.throw(/Cannot validate asynchronous rules synchronously/);
        });
    });

    describe('errors', () => {
        it('encodes to JSON', () => {
            const err = Jo.validateSync('foo', Jo.number()).error;
            expect(JSON.stringify(err)).to.equal(JSON.stringify({
                isJoi: true,
                name: 'ValidationError',
                details: [{
                    path: '',
                    type: 'number',
                    context: {},
                    message: '"undefined" must be a number.',
                }],
            }));
        });

        it('captures stacktraces on request', () => {
            const err = Jo.validateSync('foo', Jo.number(), { captureStack: true }).error;
            expect(err.stack).to.contain('validator.test.js');
        });
    });

    describe('convert', () => {
        it('works by default', (done) => {
            Jo.validate('42', Jo.number(), (err, value) => {
                expect(err).to.be.null;
                expect(value).to.equal(42);
                done();
            });
        });

        it('does not convert when off', (done) => {
            Jo.validate('42', Jo.number(), { convert: false }, (err, value) => {
                expect(err).to.not.be.null;
                done();
            });
        });
    });
});
