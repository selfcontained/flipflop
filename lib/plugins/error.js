var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog) {
	return {
		blog: blog,
		recent_articles : blog.api.getRecent(),
		pageTitle : blog.title,
		keywords : blog.keywords
	};
}

module.exports = {

	generate : function(blog, dir) {
		var routePath = blog.routes.error,
			routeFile = /\.html$/.test(routePath) ? '' : 'index.html';

		handler.createHtmlFile(
			path.join(dir, routePath, routeFile),
			path.join(blog.dir, 'theme', 'templates', '404.jade'),
			getTemplateData(blog)
		);
	}

};
