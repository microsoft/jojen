const modules = [
    require('./any'),
    require('./object'),
];

export default modules.reduce((rules, set) => rules.concat(set), []);
