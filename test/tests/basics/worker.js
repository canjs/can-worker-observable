var DefineMap = require("can-define/map/map");
var workerObservable = require("can-worker-observable");

var FooViewModel = DefineMap.extend("FooViewModel", {
  seal: false
}, {
  foo: {
    value: "bar"
  }
});

workerObservable.link(FooViewModel);
