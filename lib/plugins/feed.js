var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog) {
	return {
		articles : blog.api.getAll(),
		title : blog.title
	};
}

module.exports = {

	register : function(blog) {
		blog.app.get('/feed/rss.xml', function(req, res) {
			blog.info('serving feed');
			res.contentType('application/xml');
			res.render('feed', getTemplateData(blog));
		});
	},

	generate : function(blog, dir) {
		handler.createHtmlFile(
			path.join(dir, 'feed', 'rss.xml'),
			path.join(blog.dir, 'theme', 'templates', 'feed.jade'),
			getTemplateData(blog)
		);
	}

};
