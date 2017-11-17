var canReflect = require("can-reflect");
var stache = require("can-stache");
var workerObservable = require("can-worker-observable");

var worker = new Worker("../../../node_modules/steal/steal.js?config=package.json!npm&baseURL=/&main=test/tests/basics/worker");

var api = workerObservable.proxy(worker);

var FooViewModel = api.FooViewModel;

var vm = new FooViewModel();

var view = stache("<span>Hello {{foo}}</span>");
document.body.appendChild(view(vm));

canReflect.onKeyValue(vm, "foo", function(){
  console.log("FOO IS", arguments);
});
