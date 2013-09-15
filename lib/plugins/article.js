var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog, article) {
	return {
		blog: blog,
		recent_articles : blog.api.getRecent(),
		article : article,
		pageTitle : article.title,
		keywords : article.tags.join()
	};
}

module.exports = {

	register : function(blog) {
		if(!/:slug/.test(blog.routes.article)) throw new Error('must include :slug param in tag route');

		blog.app.get(blog.routes.article, function(req, res) {
			var article = blog.api.get(req.param('slug'));

			blog.info('serving article: ', article.title);
			if(article && article.publish) {
				res.render('article', getTemplateData(blog, article));
			}else {
				res.render('404', {
					status: 404,
					recent_articles : blog.api.getRecent()
				});
			}
		});
	},

	generate : function(blog, dir) {
		if(!/slug/.test(blog.routes.article)) throw new Error('must include slug param in tag route');

		blog.api.getAll().forEach(function(article) {
			if(article.publish) {
				var routePath = article.path,
					routeFile = /\.html$/.test(routePath) ? '' : 'index.html';

				handler.createHtmlFile(
					path.join(dir, routePath, routeFile),
					path.join(blog.dir, 'theme', 'templates', 'article.jade'),
					getTemplateData(blog, article)
				);
			}
		});
	}

};
