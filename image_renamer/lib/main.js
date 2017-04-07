var program = require('commander');
var colors = require('colors');
var pkg = require('../package.json');
var cli = require('./cli.js');

var currDir = process.cwd();

program
    .version(pkg.version)
    .description(pkg.description)
    .option("-t, --test", "Run in testing mode");

program.on("-help", function() {
    console.log(" Examples: ");
    console.log("");
    console.log(" $ image_renamer -t");
});

program.parse(process.argv);

try {
    if(program.args[0]) {
        currDir = program.args[0];
    }

    cli.renameFilesInDirectory(currDir, program.test);
}
catch(_error) {
    err = _error;
    console.log("[", "image_renamer".white, "]", err.toString().red);
}