const modules = [
    require('./any'),
    require('./array'),
    require('./object'),
    require('./number'),
    require('./function'),
    require('./boolean'),
    require('./string'),
];

export default modules.reduce((rules, set) => rules.concat(set), []);
