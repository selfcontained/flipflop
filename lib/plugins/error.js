var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog) {
	return {
		recent_articles : blog.api.getRecent(),
		title : blog.title,
		keywords : blog.keywords
	};
}

module.exports = {

	generate : function(blog, dir) {
		handler.createHtmlFile(
			path.join(dir, '404.html'),
			path.join(blog.dir, 'theme', 'templates', '404.jade'),
			getTemplateData(blog)
		);
	}

};
