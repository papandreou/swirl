/*global describe, setImmediate, it, __dirname*/
var childProcess = require('child_process'),
    pathModule = require('path'),
    unexpected = require('unexpected');

function makeMakeCallback(done) {
    var numOutstandingCallbacks = 0,
        doneCalled = false;
    return function makeCallback(fn) {
        numOutstandingCallbacks += 1;
        return function (err) {
            var errorToRethrow;
            if (fn) {
                try {
                    fn.apply(this, arguments);
                } catch (e) {
                    errorToRethrow = e;
                }
            }
            numOutstandingCallbacks -= 1;
            if (err && !fn) {
                if (doneCalled) {
                    throw err;
                } else {
                    doneCalled = true;
                    done(err);
                }
            } else if (numOutstandingCallbacks === 0 && !doneCalled) {
                doneCalled = true;
                done();
            }
            if (errorToRethrow) {
                throw errorToRethrow;
            }
        };
    };
}

describe('swirl', function () {
    var expect = unexpected.clone()
        .addAssertion('to exit with', function (expect, subject, value, done) {
            subject.on('exit', function (exitCode) {
                expect(exitCode, 'to equal', value);
                done();
            });
        })
        .addAssertion('to exit successfully', function (expect, subject, done) {
            expect(subject, 'to exit with', 0, done);
        })
        .addAssertion('to be a readable stream that outputs', function (expect, subject, value, done) {
            expect(done, 'to be a function');
            this.args.pop();
            var chunks = [];
            subject.on('data', function (chunk) {
                if (typeof chunk === 'string') {
                    chunk = new Buffer(chunk);
                }
                chunks.push(chunk);
            }).on('end', function () {
                var output = Buffer.concat(chunks),
                    valueIsRegExp = Object.prototype.toString.call(value) === '[object RegExp]';
                if (typeof value === 'string' || valueIsRegExp) {
                    output = output.toString('utf-8');
                }
                var err;
                try {
                    expect(output, 'to satisfy', value);
                } catch (e) {
                    err = e;
                }
                if (typeof done === 'function') {
                    setImmediate(function () {
                        done(err);
                    });
                } else if (err) {
                    throw err;
                }
            }).on('error', done);
        });

    it('should produce some output', function (done) {
        var makeCallback = makeMakeCallback(done),
            swirl = childProcess.spawn(pathModule.resolve(__dirname, '..', 'bin', 'swirl'), [
                '-H', 'Foo: Bar',
                'google.com',
                'statusCode:412'
            ]);
        swirl.stdout.on('data', function () {});
        expect(swirl, 'to exit with', 1, makeCallback());
        expect(
            swirl.stderr,
            'to be a readable stream that outputs',
            /HTTP\/1\.1 .*\/\/ should be 412 Precondition Failed/,
            makeCallback());
        swirl.stdin.end();
    });
});
