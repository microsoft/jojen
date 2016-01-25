const modules = [
    require('./any'),
    require('./array'),
    require('./object'),
];

export default modules.reduce((rules, set) => rules.concat(set), []);
