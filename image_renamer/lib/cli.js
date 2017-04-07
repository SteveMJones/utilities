var fs = require('fs');
var path = require('path');
var zpad = require('zpad');
var validExt = ['.jpg','.jpeg','.gif','.png']
var renameFilesInDirectory = function(rootPath, test=false) {
    var testLog = function() {
        return (test ? "(TEST) " : "");
    }

    if(!fs.existsSync(rootPath)) {
        throw new Error(testLog() + "Directory " + rootPath + " does not exist.");
    }

    getDirectoryPaths(rootPath)
    .forEach(function(parentDir){
        var parentDirName = path.parse(parentDir).name;
        if((idx1 = parentDirName.indexOf('(')) < parentDirName.indexOf(')')) {
            renamedParentDirName = parentDirName.slice(0,idx1).trim();
            renamedParentDir = rootPath + path.sep + renamedParentDirName;
            console.log(testLog() + "Renaming dir: " + parentDir + " to " + renamedParentDir);
            if(!test) {
                fs.renameSync(parentDir, renamedParentDir);
                parentDir = renamedParentDir;
                parentDirName = renamedParentDirName;
            }
        }
        
        console.log(testLog() + "Processing files in " + parentDir);
        var filePrefix = parentDirName
            .replace(' ', '_')
            .toLowerCase();
        var count = 0;
        getImgFilePaths(parentDir)
        .forEach(function(file) {
            count++;
            var num = zpad(count, 3);
            var ext = path.parse(file).ext.toLowerCase();
            var renamedFileName = filePrefix + '_' + num + ext; 
            console.log(testLog() + "Renaming file: " + path.parse(file).name + path.parse(file).ext + " to " + renamedFileName);
            if(!test) {
                fs.renameSync(file, parentDir + path.sep + renamedFileName);
            }
        });
    });
};

var getDirectoryPaths = function(dirPath) {
    return fs.readdirSync(dirPath)
    .map(function(file) {
        return path.join(dirPath, file);
    })
    .filter(function(file) {
        return fs.statSync(file).isDirectory();
    });
}

var getImgFilePaths = function(dirPath) {
    return fs.readdirSync(dirPath)
    .map(function(file) {
        return path.join(dirPath, file);
    })
    .filter(function(file) {
        var ext = path.parse(file).ext.toLowerCase();
        return fs.statSync(file).isFile() && (validExt.indexOf(ext) > -1);
    });
}

exports.renameFilesInDirectory = renameFilesInDirectory;