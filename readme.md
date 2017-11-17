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
