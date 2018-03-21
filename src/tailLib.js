let Parser = require("./tailParser.js");

const display = function(outputStream, text) {
  outputStream.write(text);
};

const isBadFile = function(fileName, fileSystem) {
  return !fileSystem.existsSync(fileName);
};

const readContent = function(fileName, fileSystem) {
  var contents = fileSystem.readFileSync(fileName, "utf8");
  return contents;
};

const hasSingleFile = function(filesArrayLength) {
  return filesArrayLength == 1;
};

const getLinesOfOneOrMoreFiles = function(lineCountOption, contents, fileName, filesArrayLength) {
  let requiredLines = lineCountOption["-n"];
  if (hasSingleFile(filesArrayLength)) {
    // console.log(getInputNumsOfLines(contents, requiredLines));
    return getInputNumsOfLines(contents, requiredLines);
  } else {
    return "==> " + fileName + " <==\n" + getInputNumsOfLines(contents, requiredLines) + "\n";
  }
};

const getBytesOfOneOrMoreFiles = function(byteCountOption, contents, fileName, filesArrayLength) {
  let blockChar = byteCountOption["-b"] * 512;
  let requiredchar = byteCountOption["-c"] || blockChar;
  if (hasSingleFile(filesArrayLength)) {
    return getCharacter(contents, requiredchar);
  } else {
    return "==> " + fileName + " <==\n" + getCharacter(contents, requiredchar);
  }
};

const getInputNumsOfLines = function(fileContents, requiredLines, options) {
  let splitedContent = fileContents.split("\n");
  let requiredLine = splitedContent.slice(-requiredLines).join("\n");
  return requiredLine;
};


const getCharacter = function(fileContents, requiredchar) {
  let requiredChars = fileContents.slice(-requiredchar);
  return requiredChars;
};

const getLinesOrCharacters = function(fileName, filesArrayLength, contents, options) {
  let optionsKeys = Object.keys(options);
  // let heading = "==> " + fileName + " <==" + "\n";
  if (optionsKeys.includes("-n")) {
    return getLinesOfOneOrMoreFiles(options, contents, fileName, filesArrayLength);
  } else {
    return getBytesOfOneOrMoreFiles(options, contents, fileName, filesArrayLength);
  }
};

const stdIn = function(options, inputStream, outputStream) {
  let fullContent = "";
  inputStream.setEncoding('utf8');
  let inputData = function(text) {
    fullContent += text;
  };
  inputStream.on('data', inputData);
  if (Object.keys(options).includes("-n")) {
    endData = function() {
      display(outputStream, getInputNumsOfLines(fullContent, options["-n"]));
    };
  } else {
    endData = function() {
      display(outputStream, getCharacter(fullContent, options["-c"]));
    }
  }
  inputStream.on('end', endData);
};

const hasFile = function(fileNames) {
  return fileNames.length != 0;
};

const displayLinesOrChar = function(fileNames, fs, lineOrByteCountOption, outputStream) {
  for (var index = 0; index < fileNames.length; index++) {
    let filesArrayLength = fileNames.length;
    let file = fileNames[index];
    if (isBadFile(file, fs)) {
      error = "tail: " + file + ": No such file or directory\n";
      display(outputStream, error);
    } else {
      let contents = readContent(file, fs);
      let requiredLinesOrChar = getLinesOrCharacters(file, filesArrayLength, contents, lineOrByteCountOption);
      display(outputStream, requiredLinesOrChar);
    }
  }
}

const helpTxt = function() {
  let text = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n";
  return text;
}

const main = function(allArgument, fs, inputStream, outputStream) {
  let parser = new Parser(allArgument);
  try {
    parser.parse();
    let lineOrByteCountOption = parser.getAllOptions();
    let fileNames = parser.getAllFiles();
    if (parser.hasHelpOption()) {
      display(outputStream, helpTxt());
    } else if (hasFile(fileNames)) {
      displayLinesOrChar(fileNames, fs, lineOrByteCountOption, outputStream);
    } else if (!hasFile(fileNames)) {
      stdIn(lineOrByteCountOption, inputStream, outputStream);
    }
  } catch (error) {
    display(outputStream, error);
  }
};

exports.main = main;
