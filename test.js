var w8 = require('./');
var assert = require('assert');
var co = require('co');

describe('w8', function() {

  var obj;

  describe('when given a promise', function() {
    beforeEach(function() {
      obj = new Promise(function(res) {
        setTimeout(res, 10);
      });
    });

    describe('when resolved before the timeout', function() {
      it('calls the callback', function(done) {
        w8(20, obj).then(function(err) {
          assert(!err);
          done();
        });
      });

      describe('when the promise fails', function() {
        it('rejects', function(done) {
          w8(20, Promise.reject(new Error('oh noes'))).catch(function(err) {
            assert.equal(err.message, 'oh noes');
            done();
          });
        });
      });

    });

    describe('when resolved after the timeout', function() {
      it('throws an async error', function(done) {
        w8(5, obj).catch(function(err) {
          assert(err);
          done();
        });
      });
    });

  });


  describe('when given a thunk', function() {

    beforeEach(function() {
       obj = function(cb) { setTimeout(function() {
        cb(null, 'ok');
       }, 10); };
    });

    describe('when resolved before the timeout', function() {
      it('calls the callback', function(done) {
        w8(20, obj).then(function(result) {
          assert.equal(result, 'ok');
          done();
        });
      });
    });

    describe('when resolved after the timeout', function() {
      it('throws an async error', function(done) {
        w8(5, obj).catch(function(err) {
          assert(err);
          done();
        });
      });
    });

    describe('when the thunk throws', function() {
      it('throws an async error', function(done) {
        var thunk = function(cb) {
          cb(new Error('denied'));
        };
        w8(10, thunk).catch(function(err) {
          assert.equal(err.message, 'denied');
          done();
        });
      });
    });

    describe('when the thunk returns mutliple arguments', function() {
      it('passes the arguments along', function(done) {
        var thunk = function(cb) {
          cb(null, 1, 2);
        };
        w8(10, thunk).then(function(res) {
          assert.deepEqual(res, [1, 2]);
          done();
        });
      });
    });

  });

  describe('when given an array', function() {

    beforeEach(function() {
      obj = [
        new Promise(function(res) {setTimeout(function() {res('a')}, 10)}),
        new Promise(function(res) {setTimeout(function() {res('b')}, 10)}),
        'c'
      ];
    });

    describe('when resolved before the timeout', function() {
      it('calls the callback', function(done) {
        w8(20, obj).then(function(result) {
          assert.deepEqual(result, ['a', 'b', 'c']);
          done();
        });
      });
    });

    describe('when resolved after the timeout', function() {
      it('throws an async error', function(done) {
        w8(5, obj).catch(function(err) {
          assert(err);
          done();
        });
      });
    });

  });

  describe('when given an object', function() {

    beforeEach(function() {
      obj = {
        a: new Promise(function(res) {setTimeout(function() {res('a')}, 10)}),
        b: new Promise(function(res) {setTimeout(function() {res('b')}, 10)}),
        c: 'c'
      };
    });

    describe('when resolved before the timeout', function() {
      it('calls the callback', function(done) {
        w8(20, obj).then(function(result) {
          assert.deepEqual(result, {a: 'a', b: 'b', c: 'c'});
          done();
        });
      });
    });

    describe('when resolved after the timeout', function() {
      it('throws an async error', function(done) {
        w8(5, obj).catch(function(err) {
          assert(err);
          done();
        });
      });
    });

  });

  describe('when given a falsy value', function() {

    beforeEach(function() {
       obj = null;
    });

    it('calls the callback with the falsy value', function(done) {
      w8(20, obj).then(function(result) {
        assert.equal(result, null);
        done();
      });
    });

  });

  describe('when given a scalar value', function() {

    beforeEach(function() {
       obj = 22;
    });

    it('calls the callback with the falsy value', function(done) {
      w8(20, obj).then(function(result) {
        assert.equal(result, 22);
        done();
      });
    });

  });


  // end to end
  describe('passes and throws in a normal co workflow', function() {
    it('runs', function(done) {
      var makePromise = function() {
        return new Promise(function(res, rej) {
          setTimeout(res, 10);
        });
      }
      co(function *() {
        yield w8(20, makePromise());
        try {
          yield w8(5, makePromise());
        } catch (e) {
          done();
        }
      });
    });
  });
});
