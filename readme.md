# can-worker-observable

Create observables that work in a web worker.

__WIP__: This is only a proof of concept. Do not use.

See the `test/tests/basics` folder for a full example. It looks like this:

```js
var stache = require("can-stache");
var workerObservable = require("can-worker-observable");

var worker = new Worker("./path/to/worker.js");

var api = workerObservable.proxy(worker);
var FooViewModel = api.FooViewModel;

var vm = new FooViewModel();

var view = stache("<span>Hello {{foo}}</span>");
document.body.appendChild(view(vm));
```

![it works](https://user-images.githubusercontent.com/361671/32925193-a2cf4bac-cb0e-11e7-86f8-245471667d3a.gif)
