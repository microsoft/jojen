const modules = [
    require('./any'),
    require('./array'),
    require('./object'),
    require('./number'),
    require('./function'),
];

export default modules.reduce((rules, set) => rules.concat(set), []);
