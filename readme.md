# can-worker-observable

[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/can-worker-observable.svg)](https://greenkeeper.io/)

Create observables that work in a web worker.

__WIP__: This is only a proof of concept. Do not use.

See the `test/tests/basics` folder for a full example. It looks like this:

```js
const stache = require("can-stache");
const { connect }  = require("can-worker-observable");

let worker = new Worker("./path/to/worker.js");

let { FooViewModel } = connect(worker);

let vm = new FooViewModel();

let view = stache("<span>Hello {{foo}}</span>");
document.body.appendChild(view(vm));
```
