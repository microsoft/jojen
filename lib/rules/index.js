const modules = [
    require('./any'),
    require('./array'),
    require('./date'),
    require('./object'),
    require('./number'),
    require('./function'),
    require('./boolean'),
    require('./string'),
    require('./alternatives'),
];

export default modules.reduce((rules, set) => rules.concat(set), []);
