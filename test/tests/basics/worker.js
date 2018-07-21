var DefineMap = require("can-define/map/map");
var obs = require("can-worker-observable");

var FooViewModel = DefineMap.extend("FooViewModel", {
  foo: {
    default: "bar"
  }
});

obs.provide(FooViewModel);
