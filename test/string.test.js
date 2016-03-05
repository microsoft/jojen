import urlFixtures from './string.fixture';

describe('string', () => {
    it('will only validate strings', () => {
        expect(Jo => Jo.string()).to.failOn(1);
        expect(Jo => Jo.string()).to.failOn(null);
        expect(Jo => Jo.string()).to.failOn(false);
        expect(Jo => Jo.string()).to.failOn('');
        expect(Jo => Jo.string()).to.not.failOn('a');
    });

    it('will validate insensitive', () => {
        expect(Jo => Jo.string().insensitive().valid('a')).to.not.failOn('A');
        expect(Jo => Jo.string().insensitive().valid('a')).to.not.failOn('a');
        expect(Jo => Jo.string().insensitive().valid('a')).to.failOn('b');
    });

    it('will validate min string length', () => {
        // TODO: Encoding
        expect(Jo => Jo.string().min(3)).to.failOn('');
        expect(Jo => Jo.string().min(3)).to.failOn('aa');
        expect(Jo => Jo.string().min(3)).to.not.failOn('aaa');
        expect(Jo => Jo.string().min(3)).to.not.failOn('aaaa');
    });

    it('will validate max string length', () => {
        // TODO: Encoding
        expect(Jo => Jo.string().max(3)).to.failOn('');
        expect(Jo => Jo.string().max(3)).to.not.failOn('aaa');
        expect(Jo => Jo.string().max(3)).to.failOn('aaaa');
    });

    it('will validate string length', () => {
        expect(Jo => Jo.string().length(10)).to.failOn('.........');
        expect(Jo => Jo.string().length(10)).to.not.failOn('..........');
    });

    it('will validate a credit card', () => {
        expect(Jo => Jo.string().creditCard()).to.failOn('000000000000000000000000000');
        expect(Jo => Jo.string().creditCard()).to.not.failOn('4242424242424242');
    });

    it('will match against a regex', () => {
        expect(Jo => Jo.string().regex(/test/)).to.failOn('blep');
        expect(Jo => Jo.string().regex(/test/)).to.not.failOn('test');

        expect(Jo => Jo.string().regex(/test/g)).to.not.failOn('testtest');
    });

    it('will validate alphanumeric', () => {
        expect(Jo => Jo.string().alphanum()).to.failOn('_');
        expect(Jo => Jo.string().alphanum()).to.not.failOn('abcdefghijklmnopqrstuvwxyz');
    });

    it('will validate tokens', () => {
        expect(Jo => Jo.string().token()).to.failOn('/');
        expect(Jo => Jo.string().token()).to.not.failOn('abcdefghijklmnopqrstuvwxyz_123456');
    });

    it('will validate emails', () => {
        expect(Jo => Jo.string().email()).to.not.failOn('something@something.com');
        expect(Jo => Jo.string().email()).to.failOn('something@@something.com');
    });

    it('will validate IPs', () => {
        expect(Jo => Jo.string().ip()).to.not.failOn('0.0.0.0');
        expect(Jo => Jo.string().ip()).to.failOn('0.0.0.0.0');
    });

    it('will validate URIs', () => {
        urlFixtures.forEach(pair => {
            let b = expect(Jo => Jo.string().uri(pair[2]));
            if (pair[1]) {
                b = b.not;
            }
            return b.failOn(pair[0]);
        });
    });

    it('will validate GUIDs', () => {
        expect(Jo => Jo.string().guid()).to.not.failOn('d97e5f69-3344-467c-9171-af2a57c3fe14');
        expect(Jo => Jo.string().guid()).to.not.failOn('462ba247-8488-47bb-b1b7-207e210acb76');
        expect(Jo => Jo.string().guid()).to.failOn('462ba247-8488-47bb-b17-2e210acb76');
        expect(Jo => Jo.string().guid()).to.failOn(':D:DD:D:DD:');
    });

    it('will validate HEX', () => {
        expect(Jo => Jo.string().hex()).to.not.failOn('af2a57c3fe14');
        expect(Jo => Jo.string().hex()).to.failOn('zzzz');
    });

    it('will validate hostnames', () => {
    });

    it('will validate lowercase', () => {
        expect(Jo => Jo.string().lowercase()).to.failOn('AAAA', undefined, false, { convert: false });
        expect(Jo => Jo.string().lowercase()).to.not.failOn('aaaa');
        expect(Jo => Jo.string().lowercase()).to.not.failOn('AAAA');
    });

    it('will validate uppercase', () => {
        expect(Jo => Jo.string().uppercase()).to.not.failOn('AAAA');
        expect(Jo => Jo.string().uppercase()).to.failOn('aaaa', undefined, false, { convert: false });
        expect(Jo => Jo.string().uppercase()).to.not.failOn('aaaa');
    });

    it('will validate trim', () => {
        expect(Jo => Jo.string().trim()).to.not.failOn('AAAA');
        expect(Jo => Jo.string().trim()).to.failOn(' AAAA ', undefined, false, { convert: false });
        expect(Jo => Jo.string().trim()).to.not.failOn(' AAAA ');
    });

    it('will validate iso dates', () => {
        expect(Jo => Jo.string().isoDate()).to.not.failOn('1997');
        expect(Jo => Jo.string().isoDate()).to.not.failOn('1997-07');
        expect(Jo => Jo.string().isoDate()).to.not.failOn('1997-07-16');
        expect(Jo => Jo.string().isoDate()).to.not.failOn('1997-07-16T19:20+01:00');
        expect(Jo => Jo.string().isoDate()).to.not.failOn('1997-07-16T19:20:30+01:00');
        expect(Jo => Jo.string().isoDate()).to.not.failOn('1997-07-16T19:20:30.45+01:00');
    });
});
