const fse = require('fs-extra');

const writeFile = async (filePath, fileData) => {
  try {
    await fse.outputFile(filePath, fileData)
  } catch (err) {
    console.error(err)
  }
};

const readFile = async filePath => {
  try {
    const data = await fse.readFile(filePath)
    return data;
  } catch (err) {
    console.error(err)
  }
};

const moveFile = async (src, dest) => {
  try {
    await fse.move(src, dest)
  } catch (err) {
    console.error(err)
  }
};

const removeFile = async (path) => {
  try {
    await fse.remove(path)
  } catch (err) {
    console.error(err)
  }
}

const exists = async (path) => {
  return await fse.pathExists(f)
}

module.exports = {
  writeFile,
  readFile,
  moveFile,
  removeFile,
  exists
};
