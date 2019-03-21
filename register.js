const init = require('./runtime');

global['chrome'] = { runtime: init() };
