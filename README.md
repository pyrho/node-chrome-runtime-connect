chrome-runtime-connect
======================


Purpose
-------
Disclaimer: This is incomplete for now, still a work in progress but nonetheless
usable for simple cases.

This package allows to test the communication between a background page and a
content script.
It emulates the `chomer.runtime.Port` interface
([doc](https://developer.chrome.com/apps/runtime#type-Port).

Install
-------
`yarn add chrome-runtime-connect`

Usage
-----
```js
// a. Call this to extend the global scope with `chrome.runtime`
require('chrome-runtime-connect/register');

// b. Or call this to have a `runtime` object
const chromeRuntime = require('chrome-runtime-connect')();
```

Since the runtime API is exposed globally (using method a), in your tests your
content scripts will be able to use the runtime API as-is.

Note: This is most useful when used it combination of a browser implementation
such as [jsdom](https://github.com/jsdom/jsdom).

TODO
----
* [ ] Add tests
* [ ] Implement the rest of the API (eg. disconnect)
