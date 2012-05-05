var path = require('path');

module.exports = (function() {

	var sorted = [],
		keyed = {},
		tags = {};

	return {

		load : function (articlePath, cb) {
			var err = null,
				self = this;

			this.reset();

			if(!articlePath) return cb.call(this, new Error('must specify path of articles'));

			require('fs').readdir(articlePath, function(err, files) {
				if (err) return cb.call(self, err);

				var article;
				files.forEach(function(folder) {
					article = require('./article.js').create(path.join(articlePath, folder));
					if(article) sorted.push(article);
				});

				sorted.sort(function(a,b) {
					a = Date.parse(a.date);
					b = Date.parse(b.date);
					if (a < b)
						return 1;
					if (a > b)
						return -1;
					return 0;
				}).forEach(function(article) {
					keyed[article.slug] = article;
					(article.tags||[]).forEach(function(tag) {
						if(!tags[tag]) tags[tag] = [];
						tags[tag].push(article.slug);
					});
				});
				cb.call(self);
			});
		},

		reset : function() {
			sorted = [];
			keyed = {};
			tags = {};
		},

		getAll : function() {
			return sorted;
		},

		getRecent : function (count) {
			return sorted.slice(0, count||25);
		},

		get : function (slug) {
			return keyed[slug];
		},

		getTags : function() {
			return tags;
		},

		getByTag : function(tag) {
			var self = this,
				articles = [];
			(tags[tag]||[]).forEach(function(slug) {
				articles.push(self.get(slug));
			});
			return articles;
		}

	};

})();
