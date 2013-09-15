var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog) {
	return {
		blog: blog,
		articles : blog.api.getRecent(10),
		recent_articles : blog.api.getRecent(),
		pageTitle : blog.title,
		keywords : blog.keywords
	};
}

module.exports = {

	register : function(blog) {
		blog.app.get(blog.routes.homepage, function(req, res) {
			blog.info('serving homepage');
			res.render('homepage', getTemplateData(blog));
		});
	},

	generate : function(blog, dir) {
		var routePath = blog.routes.homepage,
			routeFile = !path.extname(routePath) ? 'index.html' : '';

		handler.createHtmlFile(
			path.join(dir, routePath, routeFile),
			path.join(blog.dir, 'theme', 'templates', 'homepage.jade'),
			getTemplateData(blog)
		);
	}

};
