import Jo from '../lib';

describe('validator', () => {
    describe('assert', () => {
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
});
