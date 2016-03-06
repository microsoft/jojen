const Joi = require('joi');
const Jo = require('../lib/index');
const chai = require('chai');
const Assertion = chai.Assertion;
const util = require('util');

const expect = global.expect = chai.expect;
const assert = global.assert = chai.assert;


function prettyPrintSchema(schema) {
    return schema.getRules().map((rule) => {
        const args = rule._params
        .map((param) => JSON.stringify(param))
        .join(', ');

        return `${rule.name()}(${args})`;
    }).join('\n');
}

function getNthCaller(n) {
    const stack = new Error().stack.split('\n').slice(1);
    const parts = (/[a-z\.]+\.js:[0-9]+/i).exec(stack[n])
    return parts[0];
}

function pad(str, length, padder) {
    while (str.length < length) {
        str += padder || ' ';
    }

    return str;
}

const validFns = [];

chai.use((_chai, utils) => {
    Assertion.addMethod('failOn', function (value, options) {
        options = options || {};
        const joValid = this._obj(Jo);
        let joiValid;
        if (options.joi !== false) {
            joiValid = this._obj(Joi);
        }

        const pretty = prettyPrintSchema(joValid);
        if (options.joi !== false) {
            validFns.push({
                caller: getNthCaller(3),
                Jojen: () => Jo.validate(value, joValid, () => {}),
                Joi: () => Joi.validate(value, joiValid, () => {}),
            });
        }

        Jo.validate(value, joValid, options.validator, (err) => {
            this.assert(
                !!err,
                'expected to have failed: ' + pretty,
                'expected not to have failed: ' + pretty
            );

            if (options.details) {
                expect(err && err.details).to.deep.equal(options.details);
            }

            let joiError;
            if (options.joi !== false) {
                joiError = Joi.validate(value, joiValid, options.validator).error;
            }

            if (err && (!joiError && options.joi !== false) && !options.ignoreCompability) {
                assert.fail(
                    err,
                    null,
                    'Jojen failed, but Joi did not. Jojen\'s output: \n' + util.inspect(err)
                );
            } else if (!err && joiError) {
                assert.fail(null, joiError, 'Joi failed, but Jojen did not. Joi\'s output: \n' + JSON.stringify(joiError, undefined, 4));
            }
        });
    }, function () {
        utils.flag(this, 'result.error', true);
    });
});

function runBench(iterations) {
    console.log(`Running ${iterations}x${validFns.length * 2} head-to-head head to head iterations against Joi`);

    const Progress = require('progress');
    const chalk = require('chalk');

    const time = (fn) => {
        const start = Date.now();
        for (let i = 0; i < iterations; i++) {
            fn();
        }
        return Date.now() - start;
    };

    const bar = new Progress('[:bar] :percent', {
        total: validFns.length * 2,
        width: 60,
        incomplete: ' '
    });

    const results = validFns.map((v) => {
        const joi = time(v.Joi);
        bar.tick();
        const jojen = time(v.Jojen);
        bar.tick();

        return { joi, jojen, delta: joi / jojen, caller: v.caller };
    }).sort((a, b) => b.delta - a.delta);

    let sum = 0;
    results.forEach(function (r) {
        let str = pad(r.delta.toFixed(2) + 'x', 8);
        if (r.delta < 1) {
            str = chalk.red(str);
        } else {
            str = chalk.green(str);
        }
        sum += r.delta;

        str += pad(`(Joi: ${r.joi}ms / Jojen: ${r.jojen}ms)`, 40);
        str += r.caller;
        console.log(str);
    });

    console.log(' Average => ' + (sum / results.length).toFixed(2) + 'x faster');
}

process.on('exit', () => {
    if (process.env.JO_BENCH) {
        runBench(parseInt(process.env.JO_BENCH, 10) || 1000);
    }
});
