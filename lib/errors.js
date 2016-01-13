export class ValidatorError extends Error {
    constructor(rule, path) {
        super(`Validator ${rule} has failed.`);
        this.path = path;
        this.rule = rule;
    }
}
