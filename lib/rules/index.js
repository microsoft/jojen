const modules = [
    require('./any'),
];

export default modules.reduce((rules, set) => rules.concat(set), []);
