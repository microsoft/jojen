const modules = [
    require('./any'),
    require('./array'),
    require('./object'),
    require('./number'),
];

export default modules.reduce((rules, set) => rules.concat(set), []);
