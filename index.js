
/**
 * Module dependencies
 */

var fs           = require('fs');
var path         = require('path');
var EventEmitter = require('events').EventEmitter;

var define    = Object.defineProperty;
var isArray   = Array.isArray;
var stat      = fs.statSync;
var readdir   = fs.readdirSync;
var relative  = path.relative;
var resolve   = path.resolve;
var extname   = path.extname;
var dirname   = path.dirname;

/**
 * Checks if path is a directory
 *
 * @api private
 * @param {String} filepath
 */
function isDirectory (filepath) {
  try { return stat(filepath).isDirectory(); }
  catch (e) { return false; }
}

/**
 * Checks if path is a file
 *
 * @api private
 * @param {String} filepath
 */
function isFile (filepath) {
  try { return stat(filepath).isFile(); }
  catch (e) { return false; }
}

/**
 * creates a new `Loader` instance
 *
 * @api public
 * @param {String} dir
 */
module.exports.Loader = Loader;
function Loader (dir) {
  var tmp = null;
  if (!(this instanceof Loader)) return new Loader(dir);
  tmp = dir;
  if (!isDirectory(dir)) { tmp = resolve(dirname(module.parent.id), dir) }
  dir = tmp;
  if (!isDirectory(dir)) { throw new Error("Invalid directory"); }
  this.directory = dir;
}

/**
 * inherit from `EventEmitter`
 */

Loader.prototype.__proto__ = EventEmitter.prototype;

/**
 * loads a directory's files as modules
 *
 * @api public
 * @param {String} dir
 */

module.exports.load = function (dir,exclude) {
  return new Loader(dir).load(exclude);
};

/**
 * loads a directory recursively requiring
 * each file or directory as a module
 *
 * @api public
 */

Loader.prototype.load = function (exclude) {
  var tree = new Tree(this.directory, fs.readdirSync(this.directory), exclude, 1);
  return this.emit('load', tree), tree;
};

/**
 * file tree abstraction
 *
 * @api public
 * @param {Object} root
 * @param {Array} children
 * @param {Array} exclude
 */
function Tree (root, children, exclude, indent) {

  var path = null;
  var child = null;
  var i = 0;

  // ensure instance
  if (!(this instanceof Tree)) return new Tree(root, children, exclude, indent);

  if ('string' === typeof root) {
    if (!isDirectory(root)) { throw new Error("`root' is not a directory"); }
    path = root; root = {};
    define(root, 'path', {
      enumerable: false,
      writable: false,
      value: path
    });
  }

  if (false == isArray(children)) { children = []; }

  // there must be a `path` property on the `root` object
  if (!root.path) { throw new Error("Reached root without `path' property"); }
  // just return the `root` object if there are no children
  else if (!children.length) { return root; }

  path = root.path

  for (var i = 0; i < children.length; ++i) void function (child) {
    child = children[i];

    var fpath     = [path, child].join('/');
    var ext       = extname(child);
    var name      = child.replace(ext, '');
    var canIndent = true;
    
    if (['index', 'index.js'].indexOf(child) >= 0) {
        var rq = require(fpath);
        if(rq.__autoload !== undefined){rq.__autoload();}
        for (var attrname in rq) { root[attrname] = rq[attrname]; }
    }else{

      if (isDirectory(fpath)) {

        var cpath = readdir(fpath);
        if (false == isArray(cpath)) { cpath = []; }
        if (exclude){
          canIndent = true;
          exclude.forEach(function (element, index) {
            pathArray     = element.split("/");
            pathArrayLast = pathArray.length;
            target        = pathArray.splice(indent-1, 1);

            if(target.indexOf(child) >= 0){
              if(indent == pathArrayLast){
                delete exclude[index];
                canIndent = false;
              }
            }
          })

        }

        if(exclude && canIndent || !exclude){
          indent++;
          root[name] = Tree(fpath, cpath, exclude, indent);
          indent--;
        }

      } else if (isFile(fpath)) {
        define(root, name, {
          enumerable: true,
          get: function () { 
            var rq = require(fpath);
            if(rq.__autoload !== undefined){rq.__autoload();}
            return rq;
          }
        });
      } else { throw new Error("Reached invalid file `"+ fpath +"'"); }

    }
  }(children[i]);

  return root;
}
