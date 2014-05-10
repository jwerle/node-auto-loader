
var loader = require('../')
	,	assert = require('assert')
  , path = require('path')

describe('.load', function () {
	it("should load a directory's files as modules", function () {
    var modules = null;
    var app = null;
    var actrl = null;
    var user = null;

    //modules = loader.load(path.resolve(__dirname, './module'));
    modules = loader.load('./module');
		assert('function' === typeof modules.module1.func);
		assert('Test function for module1' === modules.module1.func());
		assert('function' === typeof modules.module2);
		assert('Module2 is a function' === modules.module2());
		assert('object' === typeof modules.module3)
		assert('Single property on a JSON document for module3' === modules.module3.property)

		app = loader.load([__dirname, 'app'].join('/'))
		assert('object' === typeof app);
		assert('object' === typeof app.controllers)
		assert('function' === typeof app.controllers.Application)

		actrl = new app.controllers.Application
		assert('function' === typeof actrl.index)
		assert('index action on the `Application` controller' === actrl.index());

		user = new app.controllers.User
		assert('function' === typeof user.create);
		assert('create action on the `User` controller' === user.create());
	});
});
