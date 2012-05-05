var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	jade = require('jade'),
	flipflop = require('../flipflop.js');

module.exports = {

	renderTemplate : function(template, data) {
		var	templateString = fs.readFileSync(template, 'utf8'),
			renderer = jade.compile(templateString, {
				filename : template
			});
		return renderer(data);
	},

	createHtmlFile : function(dest, template, data) {
		var	html = this.renderTemplate(template, data),
			destDir = '/'+(dest.split('/').slice(1, -1).join('/'));

		if(!path.existsSync(destDir)) {
			wrench.mkdirSyncRecursive(destDir);
		}
		fs.writeFileSync(dest, html);
		flipflop.info('created file:\t\t', dest);
	}

};
