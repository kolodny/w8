w8
===

[![Build Status](https://travis-ci.org/kolodny/w8.svg?branch=master)](https://travis-ci.org/kolodny/w8)

Limit your promises (or thunks) for use in co

#### Usage

```js
var w8 = require('w8');
var co = require('co');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

co(function *() {
  try {
    yield(w8(fs.readFileAsync('package.json')), 100);
  } catch (e) {
    console.error('getting file took more than 100 ms');
  } 
});
```
