/**
 * Object used to export constants for priorities. Rules will be reordered
 * in stable sort so that rules with lower priority values preceed those
 * of higher priorities.
 * @type {Object.<String, Number>}
 */
export default Object.freeze({
    // Halters are rules like .required() which have the ability to stop
    // further execution immediately and mark something as passed.
    halter: 0,

    // Normal priority rules are everything else!
    normal: 100,
});
