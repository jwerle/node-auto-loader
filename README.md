node-auto-loader
===============

[![Build Status](https://travis-ci.org/jwerle/node-auto-loader.png?branch=master)](https://travis-ci.org/jwerle/node-auto-loader)

A simple auto loader for nodejs

### Install
```
$ sudo npm install auto-loader
```

### Usage
You can use the loader by simply passing it a directory path. Assume you have a directory structure like this:
```
```

You could then load this module structure like this:
```js
var loader, Loader, things, thing

Loader  = require('auto-loader').Loader
loader  = new Loader(__dirname + '/things');
things  = loader.load().things;
thing   = new things.Thing("db thing");
```

### Issues
Found a bug?
[Email](joseph.werle@gmail.com) or [submit](https://github.com/jwerle/node-auto-loader/issues) all issues

Copyright and license
---------------------

Copyright 2012

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

- - -
node-auto-loader copyright 2012
moovatom - joseph.werle@gmail.com