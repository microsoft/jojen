import Ruleset from './ruleset';
import Schema from './schema';

export default class Validator extends Schema {
    constructor(ruleset) {
        this._ruleset = ruleset || new Ruleset();
    }
}
