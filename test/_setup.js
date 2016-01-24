const Joi = require('joi');
const Jo = require('../lib/index');
const chai = require('chai');
const Assertion = chai.Assertion;

global.expect = chai.expect;
global.assert = chai.assert;


function prettyPrintSchema (schema) {
    return schema._rules.map((rule) => {
        const args = rule._params
                .map((param) => JSON.stringify(param))
                .join(', ');

        return `${rule.name()}(${args})`;
    }).join('\n');
}

chai.use(function (_chai, utils) {
    Assertion.addMethod('failOn', function (value, details) {
        const joValid = this._obj(Jo);
        const joiValid = this._obj(Joi);

        const pretty = prettyPrintSchema(joValid);

        Jo.validate(value, joValid, (err) => {
            this.assert(
                !!err,
                'expected to have failed: ' + pretty,
                'expected not to have failed: ' + pretty
            );

            if (details) {
                expect(err && err.details).to.deep.equal(details);
            }

            var joiError = Joi.validate(value, joiValid).error;


            if (err && !joiError) {
                assert.fail(err, null, 'Jojen failed, but Joi did not. Jojen\'s output: \n' + JSON.stringify(err, undefined, 4));
            } else if (!err && joiError) {
                assert.fail(null, joiError, 'Joi failed, but Jojen did not. Joi\'s output: \n' + JSON.stringify(joiError, undefined, 4));
            }
        });
    }, function () {
        utils.flag(this, 'result.error', true);
    });
});
