var Promise = require('bluebird');
var path = require('path')

var fs = Promise.promisifyAll(require('fs'));

let frameworkName = 'Transmute Framework'

let patchBegin = `🦄 ${frameworkName}`
let patchEnd = `🐩 ${frameworkName}`

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

const backupPatchTarget = (targetPath) => {
    let contents
    return fs.readFileAsync(targetPath, "utf8")
        .then((_contents) => {
            contents = _contents
            return fs.writeFileAsync(targetPath + '.transmute.bak', contents, {})
        })
        .then(() => {
            return contents
        })
}

const buildPatch = (fileString) => {
    // Fix path to match result of copyTransmuteContracts
    // fileString = fileString.replace(/\.\//g, "./TransmuteFramework/");
    // convert deployer
    fileString = fileString.replace(/module\.exports/g, "const transmuteDeployer");
    fileString = `// BEGIN ${patchBegin} \n` + fileString
    fileString = fileString + `// END ${patchEnd} \n`
    return fileString
}

const patchFileAsync = (targetPath, patchFileString) => {
    return fs.readFileAsync(targetPath, "utf8")
        .then((contents) => {
            return patchFileString + '\n' + contents
        })
        .then((contents) => {
            let target = 'module.exports = function(deployer) {'
            let patchCall = '\ttransmuteDeployer(deployer)\n'
            let comment = '\t// Patched by Transmute Framework\n'
            let patch = target + '\n' + comment + patchCall
            return contents = contents.replace(target, patch);
        })
        .then((result) => {
            return fs.writeFileAsync(targetPath, result, {})
        })
}

module.exports.patchFiles = (patchTargetPath, transmuteMigrations) => {

    return backupPatchTarget(patchTargetPath)
        .then((contents) => {
            // console.log('got here...')
            if (contents.indexOf(patchBegin) !== -1) {
                throw Error('Already patched, aborting... consider unpatch')
            } else {
                return fs.readFileAsync(transmuteMigrations, "utf8")
                    .then((contents) => {
                        return buildPatch(contents)
                    })
            }
        })
        .then((patch) => {
            return patchFileAsync(patchTargetPath, patch)
            // console.log("PATCH", result);
        })
}

const deleteFile = (file) => {
    return fs.unlink(file, (err) => {
    })
}

module.exports.unpatchFiles = (patchedFilePath, backupFilePath) => {
    let contents
    return fs.readFileAsync(backupFilePath, "utf8")
        .then((_contents) => {
            contents = _contents
            return fs.writeFileAsync(patchedFilePath, contents, {})
        })
        .then(() => {
            return deleteFile(backupFilePath)
        })
}



