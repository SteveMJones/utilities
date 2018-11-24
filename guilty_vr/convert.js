var fs = require('fs');
var path = require('path');
var mv = require('mv');

var currDir = '/Volumes/28tb/Misc/VirtualReality';

//Read in converted list
var convertedListFileName = path.join(currDir, 'converted_list.txt');
var lines = fs.readFileSync(convertedListFileName, 'utf8').split('\n');

//Populate converted file list array
var convertedFileList = [];
lines.forEach(function(data) {
    convertedFileList.push(path.basename(data));
});

//Scan current directory
fs.readdirSync(currDir).filter(function(file) {
    if(file != '_Sort') {
        file1 = path.join(currDir, file)
        if(fs.statSync(file1).isDirectory()) {
            
            //Scan each folder
            fs.readdirSync(file1).filter(function(file) {
                file2 = path.join(file1, file);
                if(fs.statSync(file2).isFile()) {
                    //Check to see if converted
                    if(convertedFileList.indexOf(file) != -1) {
                        var srcFile = file2;
                        var dstFile = path.join(file1, '_converted', file);
                        console.log('SRC: ' + srcFile);
                        console.log('DST: ' + dstFile);

                        mv(srcFile, dstFile, {mkdirp: true}, function(err) {});
                    }
                }
            });
        }
    }
});

console.log("Done.");