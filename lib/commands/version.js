module.exports = function() {
	var config = require('../../package.json');
	this.log.info(config.name + ' ' + config.version);
};
