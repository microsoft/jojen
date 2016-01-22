const rules = [];
const sets = [
    require('./any')
];

sets.forEach((set) => {
    Object.keys(set).forEach((validator) => {
        rules.push(set[validator]);
    });
});

export default rules;
