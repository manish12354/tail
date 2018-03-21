let Parser = require("../src/TailParser.js");
let assert = require("assert");
let test = {};
exports.test = test;

test["should set line count option when single line count option is given"] = function() {
  let args = ["-n12", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-n": "12"
  });
};

test["should set byte count option when single byte count option is given"] = function() {
  let args = ["-c12", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-c": "12"
  });
};

test["should set line count option when single line count option and value is given saperately"] = function() {
  let args = ["-n", "12", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-n": "12"
  });
};

test["should set byte count option when single byte count option and value is given saperately"] = function() {
  let args = ["-c", "12", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-c": "12"
  });
};

test["should set block count option when single block count option and value is given saperately"] = function() {
  let args = ["-b", "12", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-b": "12"
  });
};

test["should set block count option when single block count option and value is given together"] = function() {
  let args = ["-b12", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-b": "12"
  });
};

test["should set helpOption as true when helpOption is given"] = function() {
  let args = ["-h", "12", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.ok(parser.hasHelpOption());
  args = ["--help", "12", "one.txt"];
  parser = new Parser(args);
  parser.parse();
  assert.ok(parser.hasHelpOption());
  args = ["-c", "12", "one.txt"];
  parser = new Parser(args);
  parser.parse();
  assert.ok(!parser.hasHelpOption());
};

test["should give all files"] = function() {
  let args = ["-c", "12", "./one.txt", "two.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllFiles(), ["./one.txt", "two.txt"]);
};

test["should set line count when one hyphen value is given"] = function() {
  let args = ["-3", "./one.txt", "two.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-n": "3"
  });
}

test["should throw error when more than one line count option is given"] = function() {
  let args = ["-n12", "-n10", "one.txt"];
  let parser = new Parser(args);
  let expectedError = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n"
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when more than one byte count option is given"] = function() {
  let args = ["-c12", "-c10", "one.txt"];
  let parser = new Parser(args);
  let expectedError = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n"
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when more than one line count option is given seperatly"] = function() {
  let args = ["-n", "12", "-n", "10", "one.txt"];
  let parser = new Parser(args);
  let expectedError = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n"
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when more than one byte count option is given seperatly"] = function() {
  let args = ["-c", "12", "-c", "10", "one.txt"];
  let parser = new Parser(args);
  let expectedError = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when byte count option is given without any value"] = function() {
  let args = ["-c", "12", "-c"];
  let parser = new Parser(args);
  let expectedError = "tail: option requires an argument -- c" +
    "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n"
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when line count option is given without any value"] = function() {
  let args = ["-n", "12", "-n"];
  let parser = new Parser(args);
  let expectedError = "tail: option requires an argument -- n" +
    "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when line count option is given with inValid value"] = function() {
  let args = ["-nab"];
  let parser = new Parser(args);
  let expectedError = "tail: illegal offset -- ab\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when line count option is given with inValid saperate value"] = function() {
  let args = ["-n", "ab"];
  let parser = new Parser(args);
  let expectedError = "tail: illegal offset -- ab\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when byte count option is given with inValid value"] = function() {
  let args = ["-c", "ab"];
  let parser = new Parser(args);
  let expectedError = "tail: illegal offset -- ab\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when byte count option is given with inValid saperate value"] = function() {
  let args = ["-cab"];
  let parser = new Parser(args);
  let expectedError = "tail: illegal offset -- ab\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when both line and byte count options are given with value"] = function() {
  let args = ["-c2", "-n3"];
  let parser = new Parser(args);
  let expectedError = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};
test["should throw error when both line and byte count options are given without value"] = function() {
  let args = ["-c", "-n"];
  let parser = new Parser(args);
  let expectedError = "tail: illegal offset -- -n\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw error when more than one hyphen values are given"] = function() {
  let args = ["-1", "-2"];
  let parser = new Parser(args);
  let expectedError = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
}

test["should throw illegalOptionErr when illegal option is given"] = function() {
  let args = ["-m4", "-n3"];
  let parser = new Parser(args);
  let expectedError = "tail: illegal option -- m" +
    "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};
