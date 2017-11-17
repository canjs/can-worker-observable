var canReflect = require("can-reflect");
var canSymbol = require("can-symbol");
var CID = require("can-cid");
var namespace = require("can-namespace");
var observe = require("can-observe");

var map = new Map();
var instances = new Map();
var API = canSymbol.for("can.workerObservables");
var LINKED = canSymbol.for("can.linkedObservables");
var INIT = canSymbol.for("can.workerInited");

function construct(worker, name, cid) {
  var link = worker[INIT];
  link.promise.then(function(){
    worker.postMessage({
      type: "construct",
      name: name,
      cid: cid
    });
  });
}

function assignValue(cid, value) {
  var inst = instances.get(cid);
  canReflect.assign(inst, value);
}

function onWorkerMessage(event) {
  var data = event.data;
  var type = (data && data.type) || "";
  switch(type) {
    case "init":
      event.target[INIT].resolve();
      break;
    case "value":
      assignValue(data.cid, data.value);
      break;
  }
}

function linkedProxy(worker, name) {
  // TODO can-key-tree instead?
  var linked = worker[LINKED]
  if(!linked) {
    linked = worker[LINKED] = {};
  }
  var proxy = linked[name];
  if(!proxy) {
    var fn = function(){};
    proxy = linked[name] = new Proxy(fn, {
      construct: function(target, argumentsList, newTarget) {
        var inst = Reflect.construct(target, argumentsList, newTarget);
        var observable = observe(inst);
        var cid = CID(observable);
        instances.set(cid, observable);
        construct(worker, name, cid);
        return observable;
      }
    });
  }
  return proxy;
}

function proxy(worker) {
  if(!worker[API]) {
    worker[API] = new Proxy({}, {
      get: function(target, key, receiver) {
        return linkedProxy(worker, key);
      }
    });
    worker.addEventListener("message", onWorkerMessage);
    worker[INIT] = new Deferred();
  }
  return worker[API];
}

function link(name, object) {
  if(arguments.length === 1) {
    object = name;
    name = object.name;
  }
  map.set(name, object);
  setupListener();
}

function Deferred() {
  var self = this;
  this.promise = new Promise(function(resolve, reject){
    self.resolve = resolve;
    self.reject = reject;
  });
}

function constructO(name, cid) {
  var Observable = map.get(name);
  var inst = new Observable();
  inst._cid = cid;
  instances.set(cid, inst);

  var value = canReflect.serialize(inst);
  postMessage({
    type: "value",
    cid: cid,
    value: value
  });
}

function onMessage(event) {
  var data = event.data;
  var type = (data && data.type) || "";
  switch(type) {
    case "construct":
      constructO(data.name, data.cid);
      break;
  }
}

function setupListener() {
  if(setupListener.setup) return;
  setupListener.setup = true;
  self.addEventListener("message", onMessage);

  self.postMessage({
    type: "init"
  });
}

var workerObservable = {
  link: link,
  proxy: proxy
};

module.exports = workerObservable;
namespace.workerObservable = workerObservable;
