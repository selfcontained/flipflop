var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog) {
	return {
		blog : blog,
		articles : blog.api.getAll(),
		blogTitle : blog.title,
		domain : blog.domain
	};
}

module.exports = {

	register : function(blog) {
		blog.app.get(blog.routes.feed, function(req, res) {
			blog.info('serving feed');
			res.contentType('application/xml');
			res.render('feed', getTemplateData(blog));
		});
	},

	generate : function(blog, dir) {
		var routePath = blog.routes.feed,
			routeFile = /\.xml$/.test(routePath) ? '' : 'rss.xml';

		handler.createHtmlFile(
			path.join(dir, routePath, routeFile),
			path.join(blog.dir, 'theme', 'templates', 'feed.jade'),
			getTemplateData(blog)
		);
	}

};
