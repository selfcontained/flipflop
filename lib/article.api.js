var ArticleAPI = function() {

	this.path = null;
	this.sorted = [];
	this.keyed = {};
	this.tags = {};

	this.load = function (articlePath, cb) {
		var err = null,
			self = this,
			path = require('path');

		if(!articlePath) return cb.call(this, new Error('must specify path of articles'));

		this.path = articlePath;

		require('fs').readdir(this.path, function(err, files) {
			if (err) return cb.call(self, err);

			var article;
			files.forEach(function(folder) {
				article = require('./article.js').create(path.join(self.path, folder));
				if(article) self.sorted.push(article);
			});

			self.sorted.sort(function(a,b) {
				a = Date.parse(a.date);
				b = Date.parse(b.date);
				if (a < b)
					return 1;
				if (a > b)
					return -1;
				return 0;
			}).forEach(function(article) {
				self.keyed[article.slug] = article;
				(article.tags||[]).forEach(function(tag) {
					if(!self.tags[tag]) self.tags[tag] = [];
					self.tags[tag].push(article.slug);
				});
			});
			cb.call(self);
		});
	};

	this.getAll = function() {
		return this.sorted;
	};

	this.getRecent = function (count) {
		return this.sorted.slice(0, count||25);
	};

	this.get = function (slug) {
		return this.keyed[slug];
	};

	this.getByTag = function(tag) {
		var self = this,
			articles = [];
		(this.tags[tag]||[]).forEach(function(slug) {
			articles.push(self.get(slug));
		});
		return articles;
	};

};

module.exports = new ArticleAPI();
