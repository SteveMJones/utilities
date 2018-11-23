var fs = require('fs');
var path = require('path');
var mv = require('mv');

var currDir = process.cwd();

var processFile = function(file, siteName, moveFile) {
    if(fs.statSync(file).isFile() && path.extname(file) == '.mp4') {
        var fileName = path.basename(file);
        var fileDir = path.dirname(file);
        var parentDir = fileDir.split(path.sep).pop();
        var siteName = siteName.toLowerCase();

        //lowercase whole filename
        fileName = fileName.toLowerCase();

        //clean suffix
        suffix = [];
        suffix.push('_180_180x180_3dh_LR');
        suffix.push('_oculus_180_180x180_3dh_LR');
        suffix.push('.3d.sbs.180');
        suffix.push('_5k_');

        for(val in suffix) {
            fileName = fileName.replace(val, '');
        }
        
        //clean special
        special = [];
        special.push('-');
        special.push('.');
        special.push(' ');
        special.push('-_-');
        
        for(val in special) {
            fileName = fileName.replace(val, '_');
        }

        //rename prefix
        if(fileName.indexOf(siteName) == -1) {
            fileName = siteName + '_' + fileName;
        }

        //add extra information
        fileName = fileName.substring(0,fileName.indexOf('.mp4')) + '_180_sbs.mp4';

        console.log("Old Filename: " + path.basename(file) + ", New Filename: " + fileName);

        /*
        if(moveFile) {
            src = path.join(currDir, file);
            dst = path.join(currDir,sortFolder,file);
            mv(src, dst, {mkdirp: true}, function(err) {});
        }
        */
    }
};

//Scan current directory
fs.readdirSync(currDir).filter(function(file) {
    file1 = path.join(currDir, file)
    if(fs.statSync(file1).isDirectory()) {
        
        //Scan each folder
        fs.readdirSync(file1).filter(function(file) {

            //Could be other folders to scan
            file2 = path.join(file1, file);
            if(fs.statSync(file2).isDirectory()) {
                fs.readdirSync(file2).filter(function(file) {
                    file3 = path.join(file2, file);
                    processFile(file3, file1, true);
                });
            }
            else {
                processFile(file2, file1, false);
            }
        });
    }
});