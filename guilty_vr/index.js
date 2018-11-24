var fs = require('fs');
var path = require('path');
var mv = require('mv');
var replaceall = require("replaceall");

//var currDir = process.cwd();
var currDir = '/Volumes/28tb/Misc/VirtualReality/Oculus';

var processFile = function(file, siteName, moveFile) {
    if(fs.statSync(file).isFile() && path.extname(file) == '.mp4') {
        var fileName = path.basename(file);
        var fileDir = path.dirname(file);
        var parentDir = path.dirname(fileDir);
        var siteName = siteName.toLowerCase();

        //trim extention
        fileName = fileName.substring(0,fileName.indexOf('.mp4'));

        //clean suffix
        suffix = [];
        suffix.push('_180_180x180_3dh_LR');
        suffix.push('_180x180_3dh_LR');
        suffix.push('_180_180x180_3dh_LR');
        suffix.push('_UHD_180x180_3dh');
        suffix.push(' UHD 180x180 3dh');
        suffix.push('_180x180_3dh');
        suffix.push('_3840_180_180x180_3dh_LR');
        suffix.push('3840_180x180_3dh_LR');
        suffix.push('_3840x1920');
        suffix.push('_180_180_sbs');
        suffix.push('_oculus');
        suffix.push('_Oculus');
        suffix.push('.3d.sbs.180');
        suffix.push('_5k');
        suffix.push('_6K');
        suffix.push('_4k');
        suffix.push('(4k)');
        suffix.push('_hevc');
        suffix.push('_vrdesktophd');
        suffix.push(' Oculus Rift');
        suffix.push('_1600p_h264');
        suffix.push('_com');
        suffix.push('_h264');
        suffix.push('_h265');
        suffix.push('_3840');
        suffix.push('3200x1800');

        suffix.forEach(function(val) {
            fileName = fileName.replace(val, '');
        });
        
        //console.log('suffix: ' + fileName);

        //clean special
        special = [];
        special.push('-_-');
        special.push(' - ');
        special.push('-');
        special.push('.');
        special.push(' ');
        special.push('__');
        special.push('___');
        
        special.forEach(function(val) {
            fileName = replaceall(val, '_', fileName);
        });

        //console.log('special: ' + fileName);

        //lowercase name
        fileName = fileName.toLowerCase();
        
        //console.log('lowercase: ' + fileName);

        //rename prefix
        if(fileName.indexOf(siteName) == -1) {
            fileName = siteName + '_' + fileName;
        }

        //add extra information
        if(fileName.indexOf('_180_sbs') == -1) {
            fileName = fileName + '_180_sbs.mp4';
        }
        else {
            fileName = fileName + '.mp4';
        }

        var srcFile = file;
        var dstFile = fileDir + path.sep + fileName;

        if(moveFile) {
            dstFile = parentDir + path.sep + fileName;
        }
        
        if(srcFile != dstFile) {
            console.log("SRC: " + srcFile);
            console.log("DST: " + dstFile);

            mv(srcFile, dstFile, {mkdirp: true}, function(err) {});
        }
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
                    processFile(file3, path.basename(file1), true);
                });
            }
            else {
                processFile(file2, path.basename(file1), false);
            }
        });
    }
});

console.log("Done.");