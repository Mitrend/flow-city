const express = require('express');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

var argv = require('minimist')(process.argv.slice(2));

const port = argv.p || argv.port || 7000;
const dir = argv.d || argv.dir;

if (!dir) {
	console.error('You need to pass in a directory using `--dir`');
	process.exit();
}

const app = express();

app.get('/flows', function (req, res, next) {
	fs.readdirAsync(dir).map(flows => {
		
	})
});

app.listen(port);