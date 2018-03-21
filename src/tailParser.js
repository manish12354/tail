const startsWithHyphen = function(argument) {
  return argument.startsWith("-");
};

const isValidValue = function(value) {
  return Number.isInteger(+value) && +value != 0;
};

const isHelpOption = function(argument) {
  return argument == "--help" || argument == "-h";
};

const isUndefined = function(argument) {
  return argument == undefined;
};

const optionsRequiresValueErr = function(argument) {
  let error = "tail: option requires an argument -- " + argument.slice(1) +
    "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n"
  throw error;
};

const illegalOptionErr = function(argument) {
  if (!isValidValue(argument)) {
    let error = "tail: illegal option -- " + argument +
      "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n";
    throw error;
  }
};

const illegalOffsetErr = function(option, value) {
  let illegalError = value;
  let error = "tail: illegal offset -- " + illegalError + "\n";
  throw error;
};

const hasAlreadyOneOptions = function(options) {
  return Object.keys(options).length == 1;
};

const usageErr = function(options) {
  if (hasAlreadyOneOptions(options)) {
    let error = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n";
    throw error;
  }
};

const isGreaterThanZero = function(number) {
  return number > 0;
};



const Parser = function(userInputs) {
  this.ValidOptions = ["-n", "-c", "-b", "-f"];
  this.arguments = userInputs;
  this.options = {};
  this.files = [];
  this.repeatOption = false;
  this.helpOption = false;
}

Parser.prototype = {
  isAnyFileExist: function() {
    return this.files.length > 0;
  },

  isValidOption: function(argument) {
    let options = this.ValidOptions;
    return options.includes(argument);
  },

  startsWithOptions: function(argument) {
    let option = argument.slice(0, 2);
    let options = this.ValidOptions;;
    return options.includes(option);
  },

  startsWithOptionAndValue: function(argument) {
    return argument.length > 2 && this.startsWithOptions(argument);
  },

  hasOptions: function() {
    return Object.keys(this.options).length != 0;
  },

  setCombinedOptions: function(argument) {
    usageErr(this.options);
    let option = argument.slice(0, 2);
    let value = argument.slice(2);
    if (isValidValue(value)) {
      this.options[option] = Math.abs(value);
    } else {
      throw illegalOffsetErr(option, value);
    }
  },

  setSplittedOptions: function(argument, nextInputElement) {
    if (isValidValue(nextInputElement)) {
      usageErr(this.options);
      this.options[argument] = Math.abs(nextInputElement);
    } else if (isUndefined(nextInputElement)) {
      optionsRequiresValueErr(argument);
    } else {
      throw illegalOffsetErr(argument, nextInputElement);
    }
  },

  setDefaultValue: function() {
    if (!this.hasOptions()) {
      this.options["-n"] = 10;
    }
  },

  setLineCountValue: function(argsIndex) {
    let selectedArgument = this.arguments[argsIndex];
    let illegalOption = selectedArgument.slice(1, 2);
    if (isValidValue(selectedArgument)) {
      usageErr(this.options);
      let value = selectedArgument.slice(1);
      this.options["-n"] = Math.abs(value);
    }
    illegalOptionErr(illegalOption);
  },

  pushIntoFiles: function(argsIndex) {
    let argument = this.arguments[argsIndex];
    let previousElement = this.arguments[argsIndex - 1];
    if (!this.isValidOption(previousElement)) {
      this.files.push(argument);
    }
  },

  setHelpOption: function() {
    this.helpOption = true;
  },

  dealWithHyphenValue: function(argsIndex, argument) {
    let nextInputElement = this.arguments[argsIndex + 1];
    if (isHelpOption(argument)) {
      this.setHelpOption();
    } else if (this.startsWithOptionAndValue(argument)) {
      this.setCombinedOptions(argument);
    } else if (this.isValidOption(argument)) {
      this.setSplittedOptions(argument, nextInputElement);
    } else {
      this.setLineCountValue(argsIndex);
    }
  },

  // parse: function() {
  //   for (var index = 0; index < this.arguments.length; index++) {
  //     let previousElement = this.arguments[index - 1];
  //     let argument = this.arguments[index];
  //     if (this.isAnyFileExist()) {
  //       this.pushIntoFiles(index);
  //     } else if (startsWithHyphen(argument)) {
  //       this.dealWithHyphenValue(index, argument);
  //     } else {
  //       this.pushIntoFiles(index);
  //     }
  //   }
  //   this.setDefaultValue();
  // },

  parse: function() {
    let self = this;
    self.arguments.reduce(function(options, element, index) {
      if (self.isAnyFileExist()) {
        self.pushIntoFiles(index);
      } else if (startsWithHyphen(element)) {
        self.dealWithHyphenValue(index, element);
      } else {
        self.pushIntoFiles(index);
      }
      self.setDefaultValue();
    }, self.options)
  },


  getAllFiles: function() {
    return this.files;
  },

  getAllOptions: function() {
    return this.options;
  },

  hasHelpOption: function() {
    return this.helpOption;
  }
}

module.exports = Parser;
//
// let input = process.argv.slice(2);
// let parser = new Parser(input);
// parser.parse()
// console.log(parser);
