const fs = require("fs");
const path = require("path");

export function generatorFile(_file) {
  const basename = path.basename(_file);
  const extname = path.extname(_file);
  return {
    extname,
    basename,
    uri: `file:///${_file}`,
    filename: basename.substr(0, basename.lastIndexOf(extname)),
  };
}

const ALLEXTS = [".mp4"];
const ALLFILES = [".playerc"];

function getJsonFiles(jsonPath) {
  let jsonFiles = [];

  if (!jsonPath) {
    return jsonFiles;
  }
  let files = fs.readdirSync(jsonPath);
  files.forEach(function(item, index) {
    let fPath = path.join(jsonPath, item);
    let stat = fs.statSync(fPath);
    if (
      stat.isFile() &&
      (ALLEXTS.includes(path.extname(fPath)) ||
        ALLFILES.includes(path.basename(fPath)))
    ) {
      jsonFiles.push(generatorFile(fPath));
    }
  });

  return jsonFiles;
}

export default getJsonFiles;
