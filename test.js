var w8 = require('./');
var assert = require('assert');
var co = require('co');

describe('w8', function() {

  var fn;

  describe('when given a thunk', function() {

    beforeEach(function() {
       fn = function(cb) { setTimeout(function() {
        cb(null, 'ok');
       }, 10); };
    });

    describe('when resolved before the timeout', function() {
      it('calls the callback', function(done) {
        w8(fn, 20).then(function(result) {
          assert.equal(result, 'ok');
          done();
        });
      });
    });

    describe('when resolved after the timeout', function() {
      it('throws an async error', function(done) {
        w8(fn, 5).catch(function(err) {
          assert(err);
          done();
        });
      });
    });

  });

  describe('when given a promise', function() {
    beforeEach(function() {
      fn = new Promise(function(res) {
        setTimeout(res, 10);
      });
    });

    describe('when resolved before the timeout', function() {
      it('calls the callback', function(done) {
        w8(fn, 20).then(function(err) {
          assert(!err);
          done();
        });
      });
    });

    describe('when resolved after the timeout', function() {
      it('throws an async error', function(done) {
        w8(fn, 5).catch(function(err) {
          assert(err);
          done();
        });
      });
    });

  });

  describe('passes and throws in a normal co workflow', function() {
    it('runs', function(done) {
      var makePromise = function() {
        return new Promise(function(res, rej) {
          setTimeout(res, 10);
        });
      }
      co(function *() {
        yield w8(makePromise(), 20);
        try {
          yield w8(makePromise(), 5);
        } catch (e) {
          done();
        }
      });
    });
  });
});
