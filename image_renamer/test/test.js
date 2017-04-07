var fs = require('fs');
var path = require('path');
var assert = require('assert');
var cli = require('../lib/cli.js');


var testDir = "testRun"

describe('image_renamer:', function() {
    before(function() {
        if(fs.exists(testDir)) {
            deleteTestStructure(testDir);
        }
        console.log("Creating test files - Start");
        fs.mkdirSync(testDir);
        createTestStructure(JSON.parse(fs.readFileSync('test/structure/setup_structure.json', 'utf8')));
        console.log("Creating test files - Done");
    });

    describe('main:', function() {
        var parentDirTest = testDir + path.sep + 'test';
        it('should test renaming files within a parent directory', function() {
            cli.renameFilesInDirectory(parentDirTest, true);
            //Verify against setup structure
            verifyTestStructure(JSON.parse(fs.readFileSync('test/structure/setup_structure.json', 'utf8')));
        });

        it('should rename files within a parent directory', function() {
            cli.renameFilesInDirectory(parentDirTest);
            verifyTestStructure(JSON.parse(fs.readFileSync('test/structure/verify_structure.json', 'utf8')));
        });
    });

    after(function() {
        console.log("Cleaning test files - Start");
        deleteTestStructure(testDir);
        console.log("Cleaning test files - Done");
    });

});

var createTestStructure = function(item) {
        if(item.path) {
            var path = testDir + '/' + item.path;
            if(item.dir) {
                fs.mkdirSync(path);
                console.log("Created: DIR: " + path);
            }
            else {
                fs.closeSync(fs.openSync(path, 'w'));
                console.log("Created: FILE: " + path);
            }
        }
        if(item.children) {
            item.children.forEach(function(child) {
                createTestStructure(child);
            });
        }
};

var deleteTestStructure = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteTestStructure(curPath);
        console.log("Deleted: DIR: " + curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
        console.log("Deleted: FILE: " + curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var verifyTestStructure = function(item) {
        if(item.path) {
            var path = testDir + '/' + item.path;
            if(item.dir) {
                console.log("Verifying: DIR: " + path);
                assert.ok(fs.existsSync(path));
            }
            else {
                console.log("Verifying: FILE: " + path);
                assert.ok(fs.existsSync(path));
            }
        }
        if(item.children) {
            item.children.forEach(function(child) {
                verifyTestStructure(child);
            });
        }
}