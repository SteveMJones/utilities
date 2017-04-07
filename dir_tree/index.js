const dirTree = require('directory-tree');
const tree = dirTree('test');

console.log(JSON.stringify(tree));