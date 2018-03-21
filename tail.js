let main = require('./src/tailLib.js').main;
let fs = require("fs");
let allArgument = process.argv.slice(2);
let inputStream = process.stdin;
let outputStream = process.stdout;
main(allArgument,fs,inputStream,outputStream);
