/*const modules = [
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

export default modules.reduce((rules, set) => rules.concat(set), []);*/

export * from './alternatives';
export * from './any';
export * from './array';
export * from './boolean';
export * from './function';
export * from './number';
export * from './object';
export * from './string';
export * from './date';
