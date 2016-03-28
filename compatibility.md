# Compatibility with Joi

 - Some features on not supported (yet)
 - Errors share the same _structure_, however Joi's default errors are inconsistent so we've purposely not tried to match them exactly. Particularly, the following changes to the error `details` have been made:
    - Rules in Joi that start with `any.` do not have that prefix in Jojen. Everything follows a stricted and more consistent hierarchal tree.
    - The path to values in Jojen _never_ start with `value` (e.g. `value.path.to.key` or simply `value`). This differs from Joi, where the output from both these validations are identical:

    ```js
    const schema = Joi.object({ value: Joi.required() }).required();

    assert.deepEqual(
        Joi.validate(undefined, schema),
        Joi.validate({ value: undefined }, schema),
    );
    ```

    - The `type` (rule that failed) is always equal to the rule name that was called in the construction of the validator. This differs from the undocumented behaviour in Joi where, for example, failures on the `any.forbidden` would appear as failures of `any.unknown` and failures on the `any.valid` rule would appear as failures in `any.allowOnly`.
- Unlike joi, `Jo.string()` allows empty strings, if you want to make sure empty strings are not allowed you can either use `.min(1)` or `.deny('')` instead.
