module.exports = w8;

function w8(ms, promise) {

  return new Promise(function(resolve, reject) {
    var timer = setTimeout(function() {
      reject(new Error('w8 timeout exceeded'));
    }, ms);
    toPromise(promise).then(resolve, reject);
  });

}


// everything from this point and on is taken and modified from co
// https://github.com/tj/co
function toPromise(obj) {
  if (!obj) return Promise.resolve(obj);
  if (isPromise(obj)) return obj;
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return Promise.resolve(obj);
}

function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = Array.prototype.slice.call(arguments, 1);
      resolve(res);
    });
  });
}

function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}

function objectToPromise(obj){
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    defer(promise, key);
  }
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(promise.then(function (res) {
      results[key] = res;
    }));
  }
}

function isPromise(obj) {
  return 'function' == typeof obj.then;
}

function isObject(val) {
  return Object == val.constructor;
}
