export default [
    require('./any')
].reduce((rules, set) => {
    return rules.concat(set);
}, []);
