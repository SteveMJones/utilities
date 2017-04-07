#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var mv = require('mv');

var currDir = process.cwd();

var tlds = ['.com','.net','.org'];
var prefixes = [' ', '_'];

fs.readdirSync(currDir).filter(function(file) {
    if(fs.statSync(path.join(currDir, file)).isDirectory()) {
        var sortFolder = '';
        tlds.every(function(tld) {
            if((tldIndex = file.indexOf(tld)) != -1) {
                var noPrefix = prefixes.every(function(prefix) {
                                if((prefixIndex = file.lastIndexOf(prefix,tldIndex)) != -1) {
                                    sortFolder = file.substring(prefixIndex + prefix.length, tldIndex + tld.length);
                                    return false;
                                }
                                return true;
                            });
                if(noPrefix) {
                    sortFolder = file.substring(0, tldIndex + tld.length);
                }

                return false;
            }
            return true;
        });

        if(sortFolder != '' && sortFolder != file) {
            //Move folder
            src = path.join(currDir, file);
            dst = path.join(currDir,sortFolder,file);
            mv(src, dst, {mkdirp: true}, function(err) {});
        }

        console.log('processed ' + file);
    }
});