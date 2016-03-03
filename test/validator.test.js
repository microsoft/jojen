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

    it('does not allow modifications to be run after schema optimization', () => {
        let schema = Jo.required();
        Jo.assert(1, schema);
        expect(() => {
            schema.string();
        }).to.throw(/You cannot modify schemas after you start validating them/);
    });
});
