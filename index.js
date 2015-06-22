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
  
  function explore(pathToExplore,force){

    var DirectoryName = path.basename(pathToExplore);
    var force         = force || false;

    if(fs.existsSync(pathToExplore) 
    && fs.statSync(pathToExplore).isDirectory() 
    && (   DirectoryName[0] != DirectoryName[1] 
        && DirectoryName[0] != "_" 
        || force
    )){
      var childs  = fs.readdirSync(pathToExplore);
      var root    = {};
      for(var file in childs){
        var fileName   = path.basename(childs[file]);
        var ext        = path.extname(fileName);
        var fileName   = fileName.replace(ext, '');
        if((fileName[0] != fileName[1] && fileName[0] != "_") || force){
          if(force && fileName[0] == fileName[1] && fileName[0] == "_"){fileName = fileName.substring(2);}
          if(fileName === "index"){
            var explored = explore(pathToExplore + "/" +childs[file],force);
            if(typeof explored === "object"){
              for(var propertie in explored){ 
                root[propertie] = explored[propertie];
              }
            } else{root         = explore(pathToExplore + "/" +childs[file],force);}
          } else{root[fileName] = explore(pathToExplore + "/" +childs[file],force);}
        }
      }
      return root;
    } else if(fs.existsSync(pathToExplore) && fs.statSync(pathToExplore).isFile()) {
      var rq = require(pathToExplore);
      if(rq.__autoload != undefined){
               rq.__autoload();
        delete rq.__autoload;
      } return rq;
    }else{
      return undefined;
    }
  }

  return {
    load : function (requires,callbackOrForce,force){
      var autoload = {};
      var force    = (typeof callbackOrForce === "boolean") ? callbackOrForce || false : force || false;
      if (typeof requires === "string"){ autoload = explore(requires,force); }
      else { for(var i in requires){ autoload[i]  = explore(requires[i],force); }}
      if (typeof callbackOrForce === "function"){ callbackOrForce(autoload);}
      return autoload;
    }
  };

}()