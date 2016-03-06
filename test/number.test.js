describe('number', () => {
    it('will only validate valid numbers', () => {
        expect(Jo => Jo.number()).to.failOn(null);
        expect(Jo => Jo.number()).to.failOn('foobar');
        expect(Jo => Jo.number()).to.failOn(NaN);
        expect(Jo => Jo.number()).not.to.failOn(1);
    });

    it('only allows integers', () => {
        const integer = 42;
        const negInteger = -42;
        const float = 42.42;
        expect(Jo => Jo.number().integer()).to.not.failOn(integer);
        expect(Jo => Jo.number().integer()).to.not.failOn(negInteger);
        expect(Jo => Jo.number().integer()).to.failOn(float);
    });

    it('checks min value', () => {
        expect(Jo => Jo.number().min(42)).to.not.failOn(42);
        expect(Jo => Jo.number().min(42)).to.not.failOn(43);
        expect(Jo => Jo.number().min(42)).to.failOn(41);
        expect(Jo => Jo.number().min(-42)).to.failOn(-43);
        expect(Jo => Jo.number().min(-42)).to.not.failOn(-41);
    });

    it('checks max value', () => {
        expect(Jo => Jo.number().max(42)).to.not.failOn(42);
        expect(Jo => Jo.number().max(42)).to.not.failOn(41);
        expect(Jo => Jo.number().max(42)).to.failOn(43);
        expect(Jo => Jo.number().max(-42)).to.failOn(-41);
        expect(Jo => Jo.number().max(-42)).to.not.failOn(-43);
    });

    it('checks greater than', () => {
        expect(Jo => Jo.number().greater(42)).to.failOn(42);
        expect(Jo => Jo.number().greater(42)).to.not.failOn(43);
        expect(Jo => Jo.number().greater(42)).to.failOn(41);
        expect(Jo => Jo.number().greater(-42)).to.failOn(-43);
        expect(Jo => Jo.number().greater(-42)).to.not.failOn(-41);
    });

    it('checks less than', () => {
        expect(Jo => Jo.number().less(42)).to.failOn(42);
        expect(Jo => Jo.number().less(42)).to.not.failOn(41);
        expect(Jo => Jo.number().less(42)).to.failOn(43);
        expect(Jo => Jo.number().less(-42)).to.failOn(-41);
        expect(Jo => Jo.number().less(-42)).to.not.failOn(-43);
    });

    it('checks positive', () => {
        expect(Jo => Jo.number().positive()).to.failOn(-1);
        expect(Jo => Jo.number().positive()).to.failOn(0);
        expect(Jo => Jo.number().positive()).to.not.failOn(1);
    });

    it('checks negative', () => {
        expect(Jo => Jo.number().negative()).to.not.failOn(-1);
        expect(Jo => Jo.number().negative()).to.failOn(0);
        expect(Jo => Jo.number().negative()).to.failOn(1);
    });

    it('checks multiple of', () => {
        expect(Jo => Jo.number().multiple(2)).to.not.failOn(-2);
        expect(Jo => Jo.number().multiple(2)).to.not.failOn(0);
        expect(Jo => Jo.number().multiple(2)).to.failOn(1);
        expect(Jo => Jo.number().multiple(2)).to.not.failOn(2);
    });

    it('checks max precision', () => {
        expect(Jo => Jo.number().precision(2)).to.not.failOn(42.42);
        expect(Jo => Jo.number().precision(2)).to.not.failOn(-42.42);
        expect(Jo => Jo.number().precision(2)).to.not.failOn(42);
        expect(Jo => Jo.number().precision(2)).to.failOn(42.424, { validator: { convert: false } });
        expect(Jo => Jo.number().precision(2)).to.failOn(
            42.4242, { validator: { convert: false } });
        expect(Jo => Jo.number().precision(2)).to.failOn(
            -42.4242, { validator: { convert: false } });
    });
});
