var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog, tag) {
	return {
		articles : blog.api.getByTag(tag),
		recent_articles : blog.api.getRecent(),
		tag : tag,
		title : tag + ' - ' + blog.title,
		keywords : blog.keywords
	};
}

module.exports = {

	register : function(blog) {
		blog.app.get('/tag/:tag/', function(req, res) {
			var tag = req.param('tag');
			blog.info('serving tag: ', tag);
			res.render('tag', getTemplateData(blog, tag));
		});
	},

	generate : function(blog, dir) {
		Object.keys(blog.api.getTags()).forEach(function(tag) {
			handler.createHtmlFile(
				path.join(dir, 'tag', tag, 'index.html'),
				path.join(blog.dir, 'theme', 'templates', 'tag.jade'),
				getTemplateData(blog, tag)
			);
		});
	}

};
