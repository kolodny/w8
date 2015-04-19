w8
===

[![Build Status](https://travis-ci.org/kolodny/w8.svg?branch=master)](https://travis-ci.org/kolodny/w8)

Limit your promises (or thunks) for use in co

#### Usage

First argument is the timeout in ms and the second is the promise/thunk/object/array, it returns a promise

```js
var w8 = require('w8');
var co = require('co');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

co(function *() {
  var fileReadPromise = fs.readFileAsync('package.json');
  try {
    yield w8(100, fileReadPromise);
  } catch (e) {
    console.error('getting file took more than 100 ms');
  } 
});
```
