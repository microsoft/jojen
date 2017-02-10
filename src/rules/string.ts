import { ComparatorRule } from '../types/comparatorRule';
import { Rule, NonOperatingRule, IRuleValidationParams, IRuleCtor } from '../types/rule';
import { SyncRule } from '../types/syncRule';
import { RuleParams } from '../RuleParams';


import * as isURL from 'validator/lib/isURL';
import * as isCreditCard from 'validator/lib/isCreditCard';
import url from 'url';
import { escapeRegExp } from '../util';

/* tslint:disable */
const emailRegex = /^[-a-z\d~!$%^&*_=+}{'?]+(\.[-a-z\d~!$%^&*_=+}{'?]+)*@([a-z\d_][-a-z\d_]*(\.[-a-z\d_]+)*\.([a-zрф]{2,})|([\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}))(:[\d]{1,5})?$/i;
const guidRegex = /^[\dA-F]{8}[-]?([\dA-F]{4}[-]?){3}[\dA-F]{12}$/i;
const hexRegex = /^[a-f\d]+$/i;

const dateRegex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const alnumRegex = /^[a-z\d]+$/i;
const tokenRegex = /^\w+$/i;
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/\d+)?$/;
const ipv6RegEx = /^(?:(?:(?:[\da-f]{1,4}:){7}(?:[\da-f]{1,4}|:))|(?:(?:[\da-f]{1,4}:){6}(?::[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3})|:))|(?:(?:[\da-f]{1,4}:){5}(?:(?:(?::[\da-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3})|:))|(?:(?:[\da-f]{1,4}:){4}(?:(?:(?::[\da-f]{1,4}){1,3})|(?:(?::[\da-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))|(?:(?:[\da-f]{1,4}:){3}(?:(?:(?::[\da-f]{1,4}){1,4})|(?:(?::[\da-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))|(?:(?:[\da-f]{1,4}:){2}(?:(?:(?::[\da-f]{1,4}){1,5})|(?:(?::[\da-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))|(?:(?:[\da-f]{1,4}:)(?:(?:(?::[\da-f]{1,4}){1,6})|(?:(?::[\da-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[\da-f]{1,4}){1,7})|(?:(?::[\da-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}))|:))(\/\d+)?)$/i;
const hostnameRegEx = /^(([a-z\d]|[a-z\d][a-z\d\-]*[a-z\d])\.)*([a-z\d]|[a-z\d][a-z\d\-]*[a-z\d])$/i;
/* tslint:enable */

export class StringValidator extends SyncRule {
    public validateSync(params: IRuleValidationParams<any>) {
        return typeof params.value === 'string';
    }

    public static ruleName() {
        return 'string';
    }
}

export class Insensitive extends NonOperatingRule {
    public compile(params: RuleParams) {
        function cmp(a: any, b: any) {
            return typeof a === 'string' && typeof b === 'string' &&
                a.toLowerCase() === b.toLowerCase();
        }

        // FIXME: Hacky
        params.invokeAll(<any>ComparatorRule, (rule: ComparatorRule) => rule.addComparator(cmp));
    }

   public  operates() {
        return false;
    }

    public static ruleName() {
        return 'string.insensitive';
    }
}

export abstract class SingleArgumentBase extends SyncRule {
    protected val: number;

    public compile(params: RuleParams) {
        this.val = params.args[0];
    }
}

export class Min extends SingleArgumentBase {

    public validateSync(params: IRuleValidationParams<string>) {
        return params.value.length >= this.val || {
            length: params.value.length,
            min: this.val,
        };
    }

    public static ruleName() {
        return 'string.min';
    }
}

export class Max extends SingleArgumentBase {

    public validateSync(params: IRuleValidationParams<string>) {
        return params.value.length <= this.val || {
            length: params.value.length,
            max: this.val,
        };
    }

    public static ruleName() {
        return 'string.max';
    }
}

export class Length extends SingleArgumentBase {

    public validateSync(params: IRuleValidationParams<string>) {
        return params.value.length === this.val || {
            length: params.value.length,
            expected: this.val,
        };
    }

    public static ruleName() {
        return 'string.length';
    }
}

class CreditCard extends SyncRule {
    public validateSync(params: IRuleValidationParams<string>) {
        return isCreditCard(params.value);
    }

    public static ruleName() {
        return 'string.creditCard';
    }
}

export class RegEx extends SyncRule {
    private regExp: RegExp;
    public compile(params: RuleParams) {
        const orig = params.args[0];
        // TODO: Once RegEx flags is available, us it!
        this.regExp = orig.global ? new RegExp(orig.source, [
            orig.multiline ? 'm' : '',
            orig.sticky ? 's' : '',
            orig.ignoreCase ? 'i' : '',
            orig.unicode ? 'u' : '',
        ].join('')) : orig;
    }

    public validateSync(params: IRuleValidationParams<string>) {
        // TODO: RegEx naming
        return this.regExp.test(params.value) || {
            regEx: this.regExp,
        };
    }

    public static ruleName() {
        return 'string.regex';
    }
}

export class AlphaNumeric extends SyncRule {
    public validateSync(params: IRuleValidationParams<string>) {
        return alnumRegex.test(params.value);
    }

    public static ruleName() {
        return 'string.alphanum';
    }
}

export class Token extends SyncRule {
    public validateSync(params: IRuleValidationParams<string>) {
        return tokenRegex.test(params.value);
    }

    public static ruleName() {
        return 'string.token';
    }
}

export class Email extends SyncRule {
    // TODO: Options

    public validateSync(params: IRuleValidationParams<string>) {
        return emailRegex.test(params.value);
    }

    public static ruleName() {
        return 'string.email';
    }
}

export type IPVersion = 'ipv4' | 'ipv6';

export class IP extends SyncRule {
    private matches = [ipv4Regex, ipv6RegEx];
    private cidr: 'forbidden' | 'required' | 'optional' = 'forbidden';
    private versions: IPVersion[] = ['ipv4', 'ipv6'];
    private cidrAllowed = false;
    private cidrRequired = false;
    public compile(params: RuleParams) {
        const options = params.args[0];
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
            this.versions = vers;
            this.matches = matches;
        }
        if (options.cidr) {
            this.cidrAllowed = options.cidr === 'required' || options.cidr === 'optional';
            this.cidrRequired = options.cidr === 'required';
        }
    }

    public validateSync(params: IRuleValidationParams<string>) {
        let reason: string;
        const res = this.matches.find(regEx => {
            const match = params.value.match(regEx);
            if (!match) {
                return false;
            }
            if (match[1] && !this.cidrAllowed) {
                reason = 'cidr-not-allowed';
                return false;
            }
            if (!match[1] && this.cidrRequired) {
                reason = 'cidr-required';
                return false;
            }
            return true;
        });
        if (!res && !reason) {
            return {
                reason: 'not-matched',
                allowed: this.versions,
            };
        }
        return {
            reason,
        }
    }

    public static ruleName() {
        return 'string.ip';
    }
}

export class URI extends SyncRule {
    private allowRelative: boolean;
    private schemes: RegExp[];
    public compile(params: RuleParams) {
        const options = params.args[0];
        if (!options) {
            return;
        }
        this.allowRelative = options.allowRelative;
        this.schemes = (this.schemes || <RegExp[]>[]).map(matcher => {
            if (matcher instanceof RegExp) {
                return matcher;
            }
            if (typeof matcher === 'string') {
                return new RegExp(`^${escapeRegExp(matcher)}$`);
            }
            return matcher;
        });
    }

    public validateSync(params: IRuleValidationParams<string>) {
        const res = url.parse(params.value);
        if (
            this.schemes &&
            !this.schemes.some(matcher => matcher.test(res.protocol.slice(0, -1)))
        ) {
            return {
                reason: 'scheme not allowed',
                allowed: this.schemes,
            };
        }
        if (!res.host) {
            if (res.path) {
                return this.allowRelative || {
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

    public static ruleName() {
        return 'string.uri';
    }
}

export class GUID extends SyncRule {
    public validateSync(params: IRuleValidationParams<string>) {
        return guidRegex.test(params.value);
    }

    public static ruleName() {
        return 'string.guid';
    }
}

export class Hex extends SyncRule {
    public validateSync(params: IRuleValidationParams<string>) {
        return hexRegex.test(params.value);
    }

    public static ruleName() {
        return 'string.hex';
    }
}

export class Hostname extends SyncRule {
    public validateSync(params: IRuleValidationParams<string>) {
        const v = params.value;
        return hostnameRegEx.test(v) || ipv4Regex.test(v) || ipv6RegEx.test(v);
    }

    public static ruleName() {
        return 'string.hostname';
    }
}

export class LowerCase extends SyncRule {
    public coerce(value: string) {
        return value.toLowerCase && value.toLowerCase();
    }

    public validateSync(params: IRuleValidationParams<string>) {
        return params.value.toLowerCase() === params.value;
    }

    public static ruleName() {
        return 'string.lowercase';
    }
}

export class UpperCase extends SyncRule {
    public coerce(value: string) {
        return value.toUpperCase();
    }

    public validateSync(params: IRuleValidationParams<string>) {
        return params.value.toUpperCase() === params.value;
    }

    public static ruleName() {
        return 'string.uppercase';
    }
}

export class Trim extends SyncRule {

    public coerce(value: string) {
        return value.trim();
    }

    public validateSync(params: IRuleValidationParams<string>) {
        return params.value.trim() === params.value;
    }

    public static ruleName() {
        return 'string.trim';
    }
}

export class IsoDate extends SyncRule {
    public validateSync(params: IRuleValidationParams<string>) {
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

    public static ruleName() {
        return 'string.isoDate';
    }
}
