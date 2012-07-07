var	path = require('path'),
	fs = require('fs'),
	util = require('utile'),
	moment = require('moment'),
	marked = require('marked').setOptions({
		gfm: true,
		pedantic: false,
		sanitize: false,
		highlight: function(code, lang) {
			return require('highlight').Highlight(code);
		}
	}),
	flipflop = require('./flipflop.js');


var Article = module.exports = function(config) {
	var date = moment(Date.parse(config.date));

	this.author = config.author;
	this.title = config.title;
	this.slug = config.slug;
	this.date = date;
	this.formatted_date = date.format('dddd MMMM D, YYYY');
	this.content = config.content;
	this.publish = config.publish;
	this.tags = config.tags;
	this.path = date.format('/YYYY/MM/DD/')+config.slug+'/';
};
Article.prototype = {

	author : null,

	title : null,

	slug : null,

	content : null,

	date : null,

	formatted_date : null,

	publish : null,

	tags : null,

	path : null

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
			config.author = flipflop.authors[config.author];
			config.slug = dir.split('/').pop();
			config.content = marked(fs.readFileSync(md, 'utf8'));
			article = new Article(config);
		}else {
			article = null;
		}
	}
	return article;
};

module.exports = Article;
