
/**
 * module dependencies
 */

var EventEmitter = require('events').EventEmitter
	,	fs = require('fs')
	, path = require('path')
	, define = Object.defineProperty
	, isArray = Array.isArray


/**
 * Checks if path is a directory
 *
 * @api private
 * @param {String} filepath
 */
function isDirectory (filepath) {
  try { 
    fs.readdirSync(filepath)
    return true;
  } catch (e) { return false; }
}

/**
 * Checks if path is a file
 *
 * @api private
 * @param {String} filepath
 */
function isFile (filepath) {
  try { 
    if (!isDirectory(filepath) && fs.existsSync(filepath)) {
      return true;
    }
  } catch (e) { return false; }
  return false;
}



/**
 * creates a new `Loader` instance
 *
 * @api public
 * @param {String} dir
 */

module.exports = Loader;
module.exports.Loader = Loader;
function Loader (dir) {
	if (!(this instanceof Loader)) return new Loader(dir);
	else if (!isDirectory(dir)) throw new Error("invalid directory");
	this.directory = dir;
}


/**
 * loads a directory's files as modules
 *
 * @api public
 * @param {String} dir
 */

Loader.load = function (dir) {
	return Loader(dir).load();
};


/**
 * inherit from `EventEmitter`
 */

Loader.prototype.__proto__ = EventEmitter.prototype;


/**
 * loads a directory recursively requiring
 * each file or directory as a module
 *
 * @api public
 */

Loader.prototype.load = function () {
	var dir = this.directory
		,	files = fs.readdirSync(dir)
		,	tree = Tree(dir, files);

	this.emit('load', tree);
	return tree;
};


/**
 * file tree abstraction
 *
 * @api public
 * @param {Object} root
 * @param {Array} children
 */

module.exports.Tree = Tree;
function Tree (root, children) {
	// ensure instance
	if (!(this instanceof Tree)) return new Tree(root, children);

	if ('string' === typeof root) {
		if (!isDirectory(root)) throw new Error("`root` is not a directory");
		root = { _path: root };
	}

	if ('object' !== typeof children || !isArray(children)) {
		children = [];
	}

	// there must be a `_path` property on the `root` object
	if (!root._path) throw new Error("reached root without `_path` property");
	// just return the `root` object if there are no children
	else if (!children.length) return root;

	var _path = root._path
	children.map(function (child) {
		// skip `index.js`
		if (!!~['index', 'index.js'].indexOf(child)) return;

		var fpath = [_path, child].join('/')
			,	ext = path.extname(child)
			,	name = child.replace(ext, '')
		
		if (isDirectory(fpath)) {
			root[name] = Tree(fpath, fs.readdirSync(fpath))
		} else if (isFile(fpath)) {
			define(root, name, {
				enumerable: true,
				set: function () {},
				get: function () {
					return require(fpath)
				}
			});
		} else {
			throw new Error("reached invalid file '"+ fpath +"'");
		}
	});

	return root;
}