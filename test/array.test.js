describe('array', () => {
    it('invalidates items that are not arrays', () => {
        expect((Jo) => Jo.array()).to.failOn(null);
        expect((Jo) => Jo.array()).to.failOn('foobar');
        expect((Jo) => Jo.array()).not.to.failOn([]);
    });

    it('allows sparse arrays only when specified', () => {
        const sparse = new Array();
        sparse[2] = 1;
        sparse[42] = 3;

        expect((Jo) => Jo.array()).to.failOn(sparse);
        expect((Jo) => Jo.array().sparse(false)).to.failOn(sparse);
        expect((Jo) => Jo.array().sparse(true)).not.to.failOn(sparse);
    });

    it('wraps single elements only when specified', () => {
        expect((Jo) => Jo.array()).to.failOn(42);
        expect((Jo) => Jo.array().single(false)).to.failOn(42);
        expect((Jo) => Jo.array().single(true)).not.to.failOn(42);
    });

    it('applies schemas to array items', () => {
        expect((Jo) => Jo.array().items(Jo.array())).to.failOn([[], 42]);
        expect((Jo) => Jo.array().items(Jo.array())).not.to.failOn([[], []]);
        expect((Jo) => Jo.array().items(Jo.array())).not.to.failOn([]);
    });

    it('requires ordered values', () => {
        expect((Jo) => Jo.array().ordered(Jo.array(), Jo.object().keys({ a: Jo.any() }))).to.failOn([{ a: 42 }, []]);
        expect((Jo) => Jo.array().ordered(Jo.array(), Jo.object().keys({ a: Jo.any() }))).not.to.failOn([[], { a: 42 }]);
        expect((Jo) => Jo.array().ordered(Jo.array(), Jo.object().keys({ a: Jo.any() }))).to.failOn([[], { a: 42 }, []]);
    });

    it('enforces min, max, and length', () => {
        expect((Jo) => Jo.array().min(2)).to.failOn([1]);
        expect((Jo) => Jo.array().min(2)).not.to.failOn([1, 2]);
        expect((Jo) => Jo.array().min(2)).not.to.failOn([1, 2, 3]);

        expect((Jo) => Jo.array().max(2)).not.to.failOn([1]);
        expect((Jo) => Jo.array().max(2)).not.to.failOn([1, 2]);
        expect((Jo) => Jo.array().max(2)).to.failOn([1, 2, 3]);

        expect((Jo) => Jo.array().length(2)).to.failOn([1]);
        expect((Jo) => Jo.array().length(2)).not.to.failOn([1, 2]);
        expect((Jo) => Jo.array().length(2)).to.failOn([1, 2, 3]);
    });

    it('checks unique items', () => {
        expect((Jo) => Jo.array().unique()).not.to.failOn([1, 2, 3]);
        expect((Jo) => Jo.array().unique()).to.failOn([1, 2, 2])

        expect((Jo) => Jo.array().unique()).not.to.failOn([{ a: 1 }, { a: 2 }, { b: 2 }]);
        expect((Jo) => Jo.array().unique()).to.failOn([{ a: 1 }, { a: 2 }, { a: 2 }]);

        expect((Jo) => Jo.array().unique('a')).not.to.failOn([{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 1 }]);
        expect((Jo) => Jo.array().unique('a')).to.failOn([{ a: 1, b: 2 }, { a: 1, b: 3 }, { a: 3, b: 1 }]);
        expect((Jo) => Jo.array().unique('a')).not.to.failOn([{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 3, b: 1 }]);

        expect((Jo) => Jo.array().unique('a.b')).not.to.failOn([{ a: { b: 1 }}, { a: { b: 2 }}, { a: { b: 3 }}]);
        expect((Jo) => Jo.array().unique('a.b')).to.failOn([{ a: { b: 1 }}, { a: { b: 1 }}, { a: { b: 2 }}]);

        expect((Jo) => Jo.array().unique((a, b) => a.a === b.a)).not.to.failOn([{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 3, b: 1 }]);
        expect((Jo) => Jo.array().unique((a, b) => a.a !== b.a)).to.failOn([{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 3, b: 1 }]);

        expect((Jo) => Jo.array().unique((a, b) => true)).to.failOn([{ a: 1 }, { a: 2}]);
        expect((Jo) => Jo.array().unique((a, b) => false)).not.to.failOn([{ a: 1 }, { a: 2}]);
    });
});
