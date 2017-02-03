const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

var argv = require('minimist')(process.argv.slice(2));

const port = argv.p || argv.port || 7000;
const dir = argv.d || argv.dir;

const help = `
Options:
	--port <port> 		# default is 7000
	--dir <dir> 		# Example: ../wheatley/flow-tests
`;

if (!dir) {
	console.error('You need to pass in a directory using `--dir`');
	console.log(help);
	process.exit();
}


const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/flows', function (req, res, next) {
	fs.readdirAsync(dir)
	.map(flow => {
		return fs.readFileAsync(path.join(dir, flow))
		.then(data => ({ name: flow, content: data.toString() }));
	})
	.then(flows => flows.reduce((accum, node) => {
		accum[node.name.replace('.yaml', '')] = node.content;
		return accum;
	}, {}))
	.then(data => res.json(data))
	.catch(next);

});

app.post('/flows/:flow', function (req, res, next) {
	fs.writeFileAsync(path.join(dir, req.params.flow + '.yaml'), req.body.content)
	.then(() => res.status(200).send())
	.catch(next);
});

app.listen(port, function () {
	console.log('Running on port:', port);
});