var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog) {
	return {
		blog: blog,
		recent_articles : blog.api.getRecent(),
		articles : blog.api.getAll(),
		pageTitle : 'archive - ' + blog.title,
		keywords : blog.keywords
	};
}

module.exports = {

	register : function(blog) {
		blog.app.get(blog.routes.archive, function(req, res) {
			blog.info('serving archive');
			res.render('archive', getTemplateData(blog));
		});
	},

	generate : function(blog, dir) {
		var routePath = blog.routes.archive,
			routeFile = !path.extname(routePath) ? 'index.html' : '';

		handler.createHtmlFile(
			path.join(dir, routePath, routeFile),
			path.join(blog.dir, 'theme', 'templates', 'archive.jade'),
			getTemplateData(blog)
		);
	}

};
