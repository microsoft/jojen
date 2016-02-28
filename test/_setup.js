const Joi = require('joi');
const Jo = require('../lib/index');
const chai = require('chai');
const Assertion = chai.Assertion;

const expect = global.expect = chai.expect;
const assert = global.assert = chai.assert;


function prettyPrintSchema (schema) {
    return schema._rules.map((rule) => {
        const args = rule._params
                .map((param) => JSON.stringify(param))
                .join(', ');

        return `${rule.name()}(${args})`;
    }).join('\n');
}

let validFns = [];

chai.use(function (_chai, utils) {
    Assertion.addMethod('failOn', function (value, details, ignoreCompability) {
        const joValid = this._obj(Jo);
        const joiValid = this._obj(Joi);

        const pretty = prettyPrintSchema(joValid);

        validFns.push({
            Jojen: () => Jo.validate(value, joValid, () => {}),
            Joi: () => Joi.validate(value, joiValid, () => {}),
        });

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


            if (err && !joiError && !ignoreCompability) {
                assert.fail(err, null, 'Jojen failed, but Joi did not. Jojen\'s output: \n' + JSON.stringify(err, undefined, 4));
            } else if (!err && joiError) {
                assert.fail(null, joiError, 'Joi failed, but Jojen did not. Joi\'s output: \n' + JSON.stringify(joiError, undefined, 4));
            }
        });
    }, function () {
        utils.flag(this, 'result.error', true);
    });
});

function runBench (iterations) {
    console.log('Running head-to-head benchmark for Joi vs Jojen');

    ['Jojen', 'Joi'].forEach((key) => {
        var start = Date.now();
        validFns.forEach((v) => {
            for (let i = 0; i < iterations; i++) {
                v[key]();
            }
        });

        console.log(key + ' completed in ' + (Date.now() - start) + 'ms');
    });
}

process.on('exit', function () {
    if (process.env.JO_BENCH) {
        runBench(2000);
    }
});
