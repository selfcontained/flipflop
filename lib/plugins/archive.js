var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog) {
	return {
		recent_articles : blog.api.getRecent(),
		articles : blog.api.getAll(),
		title : 'archive - ' + blog.title,
		keywords : blog.keywords
	};
}

module.exports = {

	register : function(blog) {
		blog.app.get('/archive/', function(req, res) {
			blog.info('serving archive');
			res.render('archive', getTemplateData(blog));
		});
	},

	generate : function(blog, dir) {
		handler.createHtmlFile(
			require('path').join(dir, 'archive', 'index.html'),
			path.join(blog.dir, 'theme', 'templates', 'archive.jade'),
			getTemplateData(blog)
		);
	}

};
