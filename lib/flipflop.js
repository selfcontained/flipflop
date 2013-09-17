var util = require('utile'),
	crypto = require('crypto'),
	winston = require('winston'),
	wrench = require('wrench'),
	fs = require('fs'),
	path = require('path'),
	api = require(path.join(__dirname, 'article.api'));

function createBlog() {
	var blog = {};
	winston.cli().extend(blog);

	blog.init = function(config) {
		blog.dir = config.dir;
		blog.title = config.title || 'icanhazaname?';
		blog.description = config.description || 'ucanhazdescription';
		blog.keywords = config.keywords || [];
		blog.api = api(blog);
		blog.authors = addGravatarHash(config.authors);
		blog.domain = config.domain;
		blog.routes = config.routes;
		blog.plugins = [
			require(path.join(__dirname, 'plugins', 'assets')),
			require(path.join(__dirname, 'plugins', 'error')),
			require(path.join(__dirname, 'plugins', 'homepage')),
			require(path.join(__dirname, 'plugins', 'article')),
			require(path.join(__dirname, 'plugins', 'archive')),
			require(path.join(__dirname, 'plugins', 'feed')),
			require(path.join(__dirname, 'plugins', 'tag'))
		];
		return blog;
	};

	/**
	 * Create and setup http server for serving blog dynamically
	 */
	blog.createApp = function(config) {
		var app,
			express = require('express');

		//defaults
		config = util.mixin({
			templates : path.join(blog.dir, 'theme', 'templates'),
			view_engine: 'jade',
			view_options: { layout: false },
			view_cache: false
		}, (config||{}));

		blog.app = app = express();

		app.set('views', config.templates);
		app.set('view engine', config.view_engine);
		app.set('view options', config.view_options);
		app.set('view cache', config.view_cache);
		app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
		app.use(express.bodyParser());
		app.use(express.static(path.join(blog.dir, 'theme', 'static')));
		app.use(app.router);

		blog.plugins.forEach(function(plugin) {
			if(plugin.register) plugin.register(blog);
		});
		return blog;
	};

	/**
	 * Load article data into memory
	 */
	blog.load = function(articles, cb) {
		blog.info('Loading articles');

		blog.api.load(
			articles.charAt(0) !== '/' ? path.join(blog.dir, articles) : articles,
			cb.bind(blog)
		);
	};

	/**
	 * Create static version of blog in specified directory
	 */
	blog.generate = function(dir) {
		blog.info('Generating:\t\t', dir);

		if(fs.existsSync(dir)) {
			wrench.rmdirSyncRecursive(dir);
			blog.info('Removed directory:\t', dir);
		}
		fs.mkdirSync(dir);
		blog.info('Created directory:\t', dir);
		blog.plugins.forEach(function(plugin) {
			plugin.generate(blog, dir);
		});
	};

	/**
	 * Pass-thru
	 */
	blog.listen = function(port) {
		blog.app.listen(port);
		blog.info("http server listening.", { port : port } );
		return blog;
	};

	return blog;
}

function addGravatarHash(authors) {
	for(var key in (authors||{})) {
		if (authors[key].gravatar) {
			authors[key].gravatar_hash = crypto.createHash('md5')
				.update(authors[key].gravatar)
				.digest("hex");
		}
	}
	return authors;
}

module.exports = createBlog();
