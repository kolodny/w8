w8
===

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

Give promises (and thunks/objects/arrays) a timeout that it must finish before or else it gets rejected  
Example

```js
var w8 = require('w8');
var fastPromise = new Promise(function(res) {
  setTimeout(function() {
    res('ok1');
  }, 10);
});
var slowPromise = new Promise(function(res) {
  setTimeout(function() {
    res('ok2');
  }, 1000);
});
w8(100, fastPromise).then(function(data) {
  console.log('fastPromise was fast enough');
  console.log(data); // 'ok1'
  return w8(100, slowPromise);
}).catch(function(err) {
  console.log("slowPromisie wasn't fast enough");
});
```


#### Usage

First argument is the timeout in ms and the second is the promise/thunk/object/array, it returns a promise

Here's a sample usage with [co](https://github.com/tj/co)

```js
var w8 = require('w8');
var co = require('co');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

co(function *() {
  var fileReadPromise = fs.readFileAsync('package.json');
  try {
    var pkgStr = yield w8(100, fileReadPromise).toString();
    console.log('package.json contents:', pkgStr);
  } catch (e) {
    console.error('getting file took more than 100 ms');
  }
});
```


[npm-image]: https://img.shields.io/npm/v/w8.svg?style=flat-square
[npm-url]: https://npmjs.org/package/w8
[travis-image]: https://img.shields.io/travis/kolodny/w8.svg?style=flat-square
[travis-url]: https://travis-ci.org/kolodny/w8
[coveralls-image]: https://img.shields.io/coveralls/kolodny/w8.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/kolodny/w8
[downloads-image]: http://img.shields.io/npm/dm/w8.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/w8
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/kolodny/w8?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
