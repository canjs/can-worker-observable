var canReflect = require("can-reflect");
var QUnit = require("steal-qunit");
var workerObservable = require("../can-worker-observable");
var connect = workerObservable.connect;

function before(hooks, fn) {
	if(fn.result) return fn.result;

	hooks.beforeEach(function(assert){
		var asyncO = assert.async;
		assert.async = function(){
			var done = asyncO.apply(this, arguments);
			return function(){
				fn.result = true;
				done.apply(this, arguments);
			};
		};
		return fn(assert);
	});

}

QUnit.module("basics", function(hooks) {
	before(hooks, function(assert) {
		var pth = __dirname + "/../node_modules/steal/steal.js?config=package.json!npm&baseURL=/&main=test/tests/basics/worker";
		var worker = new Worker(pth);
		this.api = connect(worker);
	});

	QUnit.module("Constructors", function(){
		QUnit.test("Get initial values", function(assert){
			var done = assert.async();
			var FooViewModel = api.FooViewModel;
			var vm = new FooViewModel();

			canReflect.onKeyValue(vm, "foo", function(newVal){
				assert.equal(newVal, "bar", "got the value from the VM");
				done();
			});
		});
	});
});
