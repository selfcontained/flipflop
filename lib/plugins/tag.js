var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog, tag) {
	return {
		blog: blog,
		articles : blog.api.getByTag(tag),
		recent_articles : blog.api.getRecent(),
		tag : tag,
		pageTitle : tag + ' - ' + blog.title,
		keywords : blog.keywords
	};
}

module.exports = {

	register : function(blog) {
		if(!/:tag/.test(blog.routes.tag)) throw new Error('must include :tag param in tag route');

		blog.app.get(blog.routes.tag, function(req, res) {
			var tag = req.param('tag');
			blog.info('serving tag: ', tag);
			res.render('tag', getTemplateData(blog, tag));
		});
	},

	generate : function(blog, dir) {
		if(!/:tag/.test(blog.routes.tag)) throw new Error('must include :tag param in tag route');

		var routePath = blog.routes.tag,
			routeFile = !path.extname(routePath) ? 'index.html' : '';

		Object.keys(blog.api.getTags()).forEach(function(tag) {
			handler.createHtmlFile(
				path.join(dir, routePath.replace(':tag', tag), routeFile),
				path.join(blog.dir, 'theme', 'templates', 'tag.jade'),
				getTemplateData(blog, tag)
			);
		});
	}

};
