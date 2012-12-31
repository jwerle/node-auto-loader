var path      = require('path')
  , Loader    = require('../lib/Loader').Loader
  , directory = path.join(__dirname, 'module')
  , assert    = require('assert')
  , loaded

console.log("Auto loading modules from" + __dirname);
loader = new Loader(directory, ['.js', '.json']);

console.log("Modules using namespace 'module'");
loaded = loader.load().module;

assert.ok(loaded['module1'], "Module1 not loaded");
assert.ok(loaded['module2'], "Module2 not loaded");
assert.ok(loaded['module3'], "Module3 not loaded");

assert.ok(typeof loaded['module1'] === 'object' &&
          typeof loaded['module1'].func === 'function',
          "Module1 was not loaded properly, expecting module1.func to be a function");
console.log("module1", loaded['module1']);

assert.ok(typeof loaded['module2'] === 'function' &&
          "Module2 was not loaded properly, expecting module2 to be a function");
console.log("module2", loaded['module2']);

assert.ok(typeof loaded['module3'] === 'object' &&
          typeof loaded['module3'].property === 'string',
          "Module3 was not loaded properly, expecting module3 to be an object");
console.log("module3", loaded['module3']);

console.log("Test all good")