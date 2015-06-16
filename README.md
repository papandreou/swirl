swirl
=====

CLI for testing HTTP servers using a [curl](http://curl.haxx.se/)-like syntax. Powered by [Unexpected](http://github.com/sunesimonsen/unexpected) and [unexpected-http](https://github.com/papandreou/unexpected-http).

[![NPM version](https://badge.fury.io/js/swirl.svg)](http://badge.fury.io/js/swirl)
[![Build Status](https://travis-ci.org/papandreou/swirl.svg?branch=master)](https://travis-ci.org/papandreou/swirl)
[![Dependency Status](https://david-dm.org/papandreou/swirl.svg)](https://david-dm.org/papandreou/swirl)

This basic selection of [curl switches](http://curl.haxx.se/docs/manpage.html)
have been implemented, but nowhere near all of them:

* `--header`, `-H`
* `--upload-file`, `-T`
* `--data`, `--data-ascii`, `-d`
* `--method`, `-X`
* `--cookie`, `-b`
* `--verbose`, `-v`
* `--silent`, `-s`
* `--cert`
* `--key`
* `--cacert`
* `--insecure`, `-k`

File an issue if you need one that's not implemented.

Additionally, these switches are supported and/or work differently from regular `curl`:

* `--html`: Render the output in HTML format. My primary use case for this is getting colored output into my clipboard like this: `swirl --html -v <url> | xclip -i -selection clipboard -t text/html`
* `--plugin <path>`: Install the given Unexpected plugin
* `-v`: Dump the entire request and response, even if the expectations aren't met. "In spirit" this is the same as `curl -v`, but the format is quite different

![Diff example](screenshot.png)
