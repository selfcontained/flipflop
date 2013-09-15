
module.exports = function(blog, article) {
	var path = Object.keys(mappings).reduce(function(path, curr) {
		return path.replace(curr, mappings[curr](article));
	}, blog.routes.article);

	return path;
};

var mappings = {

	':year': function(article) {
		return article.date.format('YYYY');
	},

	':month': function(article) {
		return article.date.format('MM');
	},

	':day': function(article) {
		return article.date.format('DD');
	},

	':slug': function(article) {
		return article.slug;
	}

};
