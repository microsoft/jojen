import Any from './any';

export function any() { return new Any(); }

/**
 * @typedef {ValidationResult}
 * @type {Object}
 * @property {ValidationError} error The validation error if the validation
 *                                   failed, or `null` otherwise.
 * @property {*} value The value under validation.
 */

/**
 * Validates the value against the Jojen schema.
 * @param  {*} value
 * @param  {Schema} schema
 * @return {Object}
 */
export function validate(value, schema) {

}
