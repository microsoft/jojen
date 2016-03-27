import Rule from '../types/syncRule';
import ComparatorRule from '../types/comparatorRule';
import SyncRule from '../types/syncRule';

import isURL from 'validator/lib/isURL';
import isCreditCard from 'validator/lib/isCreditCard';
import url from 'url';
import { escapeRegExp } from '../util';

/* eslint-disable max-len */
const emailRegex = /^[-a-z\d~!$%^&*_=+}{\'?]+(\.[-a-z\d~!$%^&*_=+}{\'?]+)*@([a-z\d_][-a-z\d_]*(\.[-a-z\d_]+)*\.([a-zрф]{2,6})|([\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}))(:[\d]{1,5})?$/i;
const guidRegex = /^[\dA-F]{8}[-]?([\dA-F]{4}[-]?){3}[\dA-F]{12}$/i;
const hexRegex = /^[a-f\d]+$/i;

const dateRegex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const alnumRegex = /^[a-z\d]+$/i;
const tokenRegex = /^\w+$/i;
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/\d+)?$/;
const ipv6RegEx = /^(?:(?:(?:[\da-f]{1,4}:){7}(?:[\da-f]{1,4}|:))|(?:(?:[\da-f]{1,4}:){6}(?::[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3})|:))|(?:(?:[\da-f]{1,4}:){5}(?:(?:(?::[\da-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3})|:))|(?:(?:[\da-f]{1,4}:){4}(?:(?:(?::[\da-f]{1,4}){1,3})|(?:(?::[\da-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))|(?:(?:[\da-f]{1,4}:){3}(?:(?:(?::[\da-f]{1,4}){1,4})|(?:(?::[\da-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))|(?:(?:[\da-f]{1,4}:){2}(?:(?:(?::[\da-f]{1,4}){1,5})|(?:(?::[\da-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))|(?:(?:[\da-f]{1,4}:)(?:(?:(?::[\da-f]{1,4}){1,6})|(?:(?::[\da-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[\da-f]{1,4}){1,7})|(?:(?::[\da-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))(\/\d+)?)$/i;
const hostnameRegEx = /^(([a-z\d]|[a-z\d][a-z\d\-]*[a-z\d])\.)*([a-z\d]|[a-z\d][a-z\d\-]*[a-z\d])$/i;
/* eslint-enable max-len */

class StringValidator extends SyncRule {
    validateSync(params) {
        return typeof params.value === 'string';
    }

    static ruleName() {
        return 'string';
    }
}

class Insensitive extends Rule {
    compile(params) {
        function cmp(a, b) {
            return typeof a === 'string' && typeof b === 'string' &&
                a.toLowerCase() === b.toLowerCase();
        }

        params.invokeAll(ComparatorRule, rule => rule.addComparator(cmp));
    }

    operates() {
        return false;
    }

    static ruleName() {
        return 'string.insensitive';
    }
}

class Min extends SyncRule {
    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        return params.value.length >= this._val || {
            length: params.value.length,
            min: this._val,
        };
    }

    static ruleName() {
        return 'string.min';
    }
}

class Max extends SyncRule {
    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        return params.value.length <= this._val || {
            length: params.value.length,
            max: this._val,
        };
    }

    static ruleName() {
        return 'string.max';
    }
}

class Length extends SyncRule {
    compile(params) {
        this._val = params.args[0];
    }

    validateSync(params) {
        return params.value.length === this._val || {
            length: params.value.length,
            expected: this._val,
        };
    }

    static ruleName() {
        return 'string.length';
    }
}

class CreditCard extends SyncRule {
    validateSync(params) {
        return isCreditCard(params.value);
    }

    static ruleName() {
        return 'string.creditCard';
    }
}

class RegEx extends SyncRule {
    compile(params) {
        const orig = params.args[0];
        // TODO: Once RegEx flags is available, us it!
        this._regEx = orig.global ? new RegExp(orig.source, [
            orig.multiline ? 'm' : '',
            orig.sticky ? 's' : '',
            orig.ignoreCase ? 'i' : '',
            orig.unicode ? 'u' : '',
        ].join('')) : orig;
    }

    validateSync(params) {
        // TODO: RegEx naming
        return this._regEx.test(params.value) || {
            regEx: this._regEx,
        };
    }

    static ruleName() {
        return 'string.regex';
    }
}

class AlphaNumeric extends SyncRule {
    validateSync(params) {
        return alnumRegex.test(params.value);
    }

    static ruleName() {
        return 'string.alphanum';
    }
}

class Token extends SyncRule {
    validateSync(params) {
        return tokenRegex.test(params.value);
    }

    static ruleName() {
        return 'string.token';
    }
}

class Email extends SyncRule {
    // TODO: Options

    validateSync(params) {
        return emailRegex.test(params.value);
    }

    static ruleName() {
        return 'string.email';
    }
}

class IP extends SyncRule {
    compile(params) {
        const options = params.args[0];
        this._matches = [ipv4Regex, ipv6RegEx];
        this._cidr = 'forbidden';
        this._versions = ['ipv4', 'ipv6'];
        if (!options) {
            return;
        }

        if (options.versions) {
            const vers = options.versions;
            const matches = [];
            if (vers.indexOf('ipv4') !== -1) {
                matches.push(ipv4Regex);
            }
            if (vers.indexOf('ipv6') !== -1) {
                matches.push(ipv6RegEx);
            }
            this._versions = vers;
            this._matches = matches;
        }
        if (options.cidr) {
            this._cidrAllowed = options.cidr === 'required' || options.cidr === 'optional';
            this._cidrRequired = options.cidr === 'required';
        }
    }

    validateSync(params) {
        const res = this._matches.some(regEx => {
            const match = params.value.match(regEx);
            if (!match) {
                return false;
            }
            if (match[1] && !this._cidrAllowed) {
                return {
                    reason: 'cidr-not-allowed',
                };
            }
            if (!match[1] && this._cidrRequired) {
                return {
                    reason: 'cidr-required',
                };
            }
            return true;
        });
        if (!res) {
            return {
                reason: 'not-matched',
                allowed: this._versions,
            };
        }
        return res;
    }

    static ruleName() {
        return 'string.ip';
    }
}

class URI extends SyncRule {

    compile(params) {
        const options = params.args[0];
        if (!options) {
            return;
        }
        this._allowRelative = options.allowRelative;
        this._schemes = (options.schemes || []).map(matcher => {
            if (matcher instanceof RegExp) {
                return matcher;
            }
            if (typeof matcher === 'string') {
                return new RegExp(`^${escapeRegExp(matcher)}$`);
            }
            return matcher;
        });
    }

    validateSync(params) {
        const res = url.parse(params.value);
        if (
            this._schemes &&
            !this._schemes.some(matcher => matcher.test(res.protocol.slice(0, -1)))
        ) {
            return {
                reason: 'scheme not allowed',
                allowed: this._schemes,
            };
        }
        if (!res.host) {
            if (res.path) {
                return this._allowRelative || {
                    reason: 'relativ-not-allowed',
                };
            }
            return false;
        }
        if (!isURL(params.value)) {
            return false;
        }
        return true;
    }

    static ruleName() {
        return 'string.uri';
    }
}

class GUID extends SyncRule {
    validateSync(params) {
        return guidRegex.test(params.value);
    }

    static ruleName() {
        return 'string.guid';
    }
}

class Hex extends SyncRule {
    validateSync(params) {
        return hexRegex.test(params.value);
    }

    static ruleName() {
        return 'string.hex';
    }
}

class Hostname extends SyncRule {
    validateSync(params) {
        const v = params.value;
        return hostnameRegEx.test(v) || ipv4Regex.test(v) || ipv6RegEx.test(v);
    }

    static ruleName() {
        return 'string.hostname';
    }
}

class LowerCase extends SyncRule {
    coerce(value) {
        return value.toLowerCase && value.toLowerCase();
    }

    validateSync(params) {
        return params.value.toLowerCase() === params.value;
    }

    static ruleName() {
        return 'string.lowercase';
    }
}

class UpperCase extends SyncRule {
    coerce(value) {
        return value.toUpperCase();
    }

    validateSync(params) {
        return params.value.toUpperCase() === params.value;
    }

    static ruleName() {
        return 'string.uppercase';
    }
}

class Trim extends SyncRule {

    coerce(value) {
        return value.trim();
    }

    validateSync(params) {
        return params.value.trim() === params.value;
    }

    static ruleName() {
        return 'string.trim';
    }
}

class IsoDate extends SyncRule {
    validateSync(params) {
        if (!dateRegex.test(params.value)) {
            return false;
        }
        try {
            Date.parse(params.value);
            return true;
        } catch (error) {
            return false;
        }
    }

    static ruleName() {
        return 'string.isoDate';
    }
}

module.exports = [
    StringValidator,
    Insensitive,
    Min,
    Max,
    Length,
    CreditCard,
    RegEx,
    AlphaNumeric,
    Token,
    Email,
    IP,
    URI,
    GUID,
    Hex,
    Hostname,
    LowerCase,
    UpperCase,
    Trim,
    IsoDate,
];
