/*
|--------------------------------------------------------------------------
| Auto-Loader
|--------------------------------------------------------------------------
| 
| Package d'auto loader aillant pour but de précharger des composants dans
| un context global afin qu'il soit manipuler plus facilement au seins de 
| l'application.
|
*/

var fs   = require("fs");
var path = require('path');

module.exports = function(){

  var autoload = {};

  function explore(pathToExplore){
    if(fs.statSync(pathToExplore).isDirectory()){
      var childs  = fs.readdirSync(pathToExplore);
      var root    = {};
      for(file in childs){
        var fileName   = path.basename(childs[file]);
        var ext        = path.extname(fileName);
        var fileName   = fileName.replace(ext, '');
        root[fileName] = explore(pathToExplore + "/" +childs[file]);
      }
      return root;
    } else {
      return require(pathToExplore);
    }
  }

  return {
    load : function (require,callback){
      for (var i in require){ autoload[i] = explore(require[i]); }
      if (callback != undefined){callback();}
      return autoload;
    }
  };

}();