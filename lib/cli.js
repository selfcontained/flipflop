var path = require('path'),
	flatiron = require('flatiron'),
	app = flatiron.app;

app.use(flatiron.plugins.cli, {
	dir: path.join(__dirname, 'commands'),
	usage: [
		'This is a basic flatiron cli application example!',
		'',
		'hello - say hello to somebody.'
	]
});

app.start();
