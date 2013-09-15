var	util = require('utile'),
	fs = require('fs'),
	path = require('path'),
	articlePath = require('./article.path'),
	moment = require('moment'),
	marked = require('marked').setOptions({
		gfm: true,
		pedantic: false,
		sanitize: false,
		highlight: function(code, lang) {
			return require('highlight').Highlight(code);
		}
	});

module.exports = function(blog) {

	var Article = function(config) {
		var date = moment(Date.parse(config.date));

		this.author = config.author;
		this.title = config.title;
		this.slug = config.slug;
		this.date = date;
		this.formatted_date = date.format('dddd MMMM D, YYYY');
		this.content = config.content;
		this.publish = config.publish;
		this.tags = config.tags;
		this.path = articlePath(blog, this);
	};

	Article.create = function(dir) {
		var json = path.join(dir, 'article.json'),
			md = path.join(dir, 'article.md'),
			article,
			config;

		if (fs.existsSync(json) && fs.existsSync(md)) {
			//clone to avoid altering same instance
			config = util.clone(require(json));

			if(config.publish) {
				config.author = blog.authors[config.author];
				config.slug = dir.split('/').pop();
				config.content = marked(fs.readFileSync(md, 'utf8'));
				article = new Article(config);
			}else {
				article = null;
			}
		}
		return article;
	};

	return Article;
};
