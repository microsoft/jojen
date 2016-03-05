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
});
