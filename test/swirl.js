/*global describe, it, __dirname*/
var childProcess = require('child_process'),
    pathModule = require('path'),
    unexpected = require('unexpected');

describe('swirl', function () {
    var expect = unexpected.clone()
        .installPlugin(require('unexpected-stream'))
        .addAssertion('to exit with', function (expect, subject, value) {
            this.errorMode = 'nested';
            return expect.promise(function (run) {
                subject.on('exit', run(function (exitCode) {
                    expect(exitCode, 'to equal', value);
                }));
            });
        })
        .addAssertion('to exit successfully', function (expect, subject) {
            this.errorMode = 'nested';
            return expect(subject, 'to exit with', 0);
        });

    it('should produce some output', function () {
        var swirl = childProcess.spawn(pathModule.resolve(__dirname, '..', 'bin', 'swirl'), [
            '-H', 'Foo: Bar',
            'google.com',
            'statusCode:412'
        ]);
        return expect.promise.all([
            expect(swirl, 'to exit with', 1),
            expect(
                swirl.stderr,
                'to yield output satisfying',
                'when decoded as', 'utf-8',
                'to satisfy',
                /HTTP\/1\.1 .*\/\/ should be 412 Precondition Failed/
            )
        ]);
    });
});
