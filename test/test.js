
var loader = require('../')
	,	assert = require('assert')

describe('.load', function () {
	it("should load a directory's files as modules", function () {
		var modules = loader.load([__dirname, 'module'].join('/'))

		assert('function' === typeof modules.module1.func);
		assert('Test function for module1' === modules.module1.func());

		assert('function' === typeof modules.module2);
		assert('Module2 is a function' === modules.module2());

		assert('object' === typeof modules.module3)
		assert('Single property on a JSON document for module3' === modules.module3.property)

		var app = loader.load([__dirname, 'app'].join('/'))

		assert('object' === typeof app);

		assert('object' === typeof app.controllers)
		assert('function' === typeof app.controllers.Application)
		
		var appCntl = new app.controllers.Application

		assert('function' === typeof appCntl.index)
		assert('index action on the `Application` controller' === appCntl.index());

		var userCntl = new app.controllers.User

		assert('function' === typeof userCntl.create);
		assert('create action on the `User` controller' === userCntl.create());
	});
});