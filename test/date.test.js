describe('date', () => {
    const opts = {
        ignoreCompability: true,
    };
    const noJoi = {
        joi: false,
    };
    it('invalidates items that are not dates', () => {
        expect(Jo => Jo.date()).to.failOn('hello', opts);
        expect(Jo => Jo.date()).to.failOn('123', opts);
        expect(Jo => Jo.date()).to.failOn('2017-02-14', opts);
    });

    it('passes values that are dates', () => {
        expect(Jo => Jo.date()).to.not.failOn('2017-02-14T22:49:06.017Z', opts);
    });

    describe('date.greaterThanNow', () => {
        it('does not allow dates in the past', () => {
            expect(Jo => Jo.date().greaterThanNow()).to.failOn(new Date(Date.now() - 1000), noJoi);
        });

        it('does does allow dates in the future', () => {
            expect(Jo => Jo.date().greaterThanNow()).to.not.failOn(new Date(Date.now() + 1000), noJoi);
        });
    });
});
