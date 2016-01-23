const chai = require('chai');
const Assertion = chai.Assertion;

global.expect = chai.expect;
global.assert = chai.assert;
global.Jo = require('../lib/index');


function prettyPrintSchema (schema) {
    return schema._rules.map((rule) => {
        const args = rule._params
                .map((param) => JSON.stringify(param))
                .join(', ');

        return `${rule.name()}(${args})`;
    }).join('\n');
}

chai.use(function (_chai, utils) {
    Assertion.addMethod('failOn', function (value) {
        const pretty = prettyPrintSchema(this._obj);

        Jo.validate(value, this._obj, (err) => {
            this.assert(
                !!err,
                'expected to have failed: ' + pretty,
                'expected not to have failed: ' + pretty
            );
        });
    }, function () {
        utils.flag(this, 'result.error', true);
    });
});
