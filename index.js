const fastFolderSize = require('fast-folder-size');
const { promisify } = require('util');
var readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fastFolderSizeAsync = promisify(fastFolderSize);
var loadingBar;


rl.question("Enter folder path : ", async function(dir) {
    if(fs.existsSync(dir)){
        var folders = fs.readdirSync(dir).filter(function (file) {
            return fs.statSync(dir+'/'+file).isDirectory();
        });

        loadingBar = [0, folders.length];
        updateLoadingBar(0, "Initial folder");
        let totalSize = await fastFolderSizeAsync(dir);
        let sizes = await getFolderSizes(dir, folders);
        
        console.log("Generating report...");

        sizes.sort(function(a, b) {
            return a[1] - b[1]
        });

        for(size in sizes){
            let temp = Math.round(20*sizes[size][1]/totalSize);
            let load = '';
            for(let x=0;x<temp;x++){
                load+="#";
            }
            for(let x=0;x<20-temp;x++){
                load+="-";
            }
            let bytes;
            if(sizes[size][1]>1000000000) bytes = (sizes[size][1] / 1000 / 1000 / 1000).toFixed(2)+" GB "
            else bytes = (sizes[size][1] / 1000 / 1000 ).toFixed(2)+" MB "
            console.log(bytes+load+" | "+sizes[size][0]);
        }
    }
});

async function getFolderSizes(dir, folders){
    let sizes = [];
    for(folder in folders){
        updateLoadingBar(parseInt(folder)+1, folders[folder]);
        let bytes = await fastFolderSizeAsync(dir+'/'+folders[folder]);
        sizes.push([folders[folder], bytes]);
    }
    return sizes;
}

function updateLoadingBar(index, text){
    loadingBar[0]=index;
    let temp = Math.round(10*loadingBar[0]/loadingBar[1]);
    let load = '';
    for(let x=0;x<temp;x++){
        load+="#";
    }
    for(let x=0;x<10-temp;x++){
        load+="-";
    }
    console.log("Loading... "+load+" | "+text);
}