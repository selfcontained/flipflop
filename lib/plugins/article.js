var path = require('path'),
	handler = require('./handler.js');

function getTemplateData(blog, article) {
	return {
		recent_articles : blog.api.getRecent(),
		article : article,
		title : article.title,
		keywords : article.tags.join()
	};
}

module.exports = {

	register : function(blog) {
		blog.app.get(/^\/(\d){4}\/(\d){2}\/(\d){2}\/(.+)\/$/, function(req, res) {
			var article = blog.api.get(req.params[3]);
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
		blog.api.getAll().forEach(function(article) {
			if(article.publish) {
				handler.createHtmlFile(
					path.join(dir, article.path, 'index.html'),
					path.join(blog.dir, 'theme', 'templates', 'article.jade'),
					getTemplateData(blog, article)
				);
			}
		});
	}

};
