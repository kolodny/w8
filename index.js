module.exports = w8;

function w8(ms, fn) {
  if (typeof fn === 'function') {
    promiseFn = new Promise(function(resolve, reject) {
      fn(function(err, result) {
        if (err) return reject(err);
        else return resolve(result);
      });
    });
  } else {
    promiseFn = fn;
  }

  return new Promise(function(resolve, reject) {
    var ran = false;
    var timer = setTimeout(function() {
      if (!ran) {
        ran = true;
        reject(new Error('w8 timeout exceeded'));
      }
    }, ms);
    promiseFn.then(function(result) {
      if (!ran) {
        ran = true;
        resolve(result);
      }
    }).catch(function(err) {
      if (!ran) {
        ran = true;
        reject(err);
      }
    });
  });

}

function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}
