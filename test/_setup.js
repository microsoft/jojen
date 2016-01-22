const chai = require('chai');
const Assertion = chai.Assertion;

global.expect = chai.expect;
global.assert = chai.assert;
global.Jo = require('../lib/index');


Assertion.addChainableMethod('fail', function () {
    this.assert(
        !!this._obj.error,
        'expected #{this} to have failed',
        'expected #{this} not to have failed'
    );
}, function () {
    chai.utils.flag(this, 'result.error', true);
});
