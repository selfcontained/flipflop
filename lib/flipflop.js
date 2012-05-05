var util = require('utile'),
	crypto = require('crypto');

function addGravatarHash(authors) {
	for(var key in (authors||{})) {
		if (authors[key].gravatar) {
			authors[key].gravatar_hash = crypto.createHash('md5').update(authors[key].gravatar).digest("hex");
		}
	}
	return authors;
}

var Blog = function() {

	this.title = null;
	this.description = null;
	this.keywords = null;
	this.app = null;
	this.api = null;
	this.plugins = null;
	this.authors = null;
	this.log = null;

	this.init = function(config) {
		this.init = function() {};

		this.title = config.title || 'icanhazaname?';
		this.description = config.description || 'ucanhazdescription';
		this.keywords = config.keywords || [];
		require('winston').cli().extend(this);
		this.api = require('./article.api.js');
		this.authors = addGravatarHash(config.authors);
		this.plugins = [
			require('./plugins/assets.js'),
			require('./plugins/error.js'),
			require('./plugins/homepage.js'),
			require('./plugins/article.js'),
			require('./plugins/archive.js'),
			require('./plugins/feed.js'),
			require('./plugins/tag.js')
		];
		return this;
	};

	/**
	 * Create and setup http server for serving blog dynamically
	 */
	this.createApp = function(config) {
		var express = require('express'),
			self = this;

		//defaults
		config = util.mixin({
			templates : __dirname+'/../theme/templates',
			view_engine: 'jade',
			view_options: { layout: false },
			view_cache: false
		}, (config||{}));

		this.app = express.createServer();
		this.app.configure(function(){
			this.set('views', config.templates);
			this.set('view engine', config.view_engine);
			this.set('view options', config.view_options);
			this.set('view cache', config.view_cache);
			this.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
			this.use(express.bodyParser());
			this.use(express.static(__dirname + '/../theme/static'));
			this.use(this.router);
		});
		this.plugins.forEach(function(handler) {
			handler.register && handler.register(self);
		});
		return this;
	};

	/**
	 * Load article data into memory
	 */
	this.load = function(articles, cb) {
		this.api.load(articles, cb.bind(this));
	};

	/**
	 * Create static version of blog in specified directory
	 */
	this.generate = function(dir) {
		var fs = require('fs'),
			self = this;

		if(require('path').existsSync(dir)) {
			require('wrench').rmdirSyncRecursive(dir);
			this.info('removed directory: %s', dir);
		}
		fs.mkdir(dir, function(err) {
			if(err) {
				self.info(err);
			}else {
				self.info('Created directory: %s', dir);
				self.plugins.forEach(function(handler) {
					handler.generate(self, dir);
				});
			}
		});
	};

	/**
	 * Pass-thru
	 */
	this.listen = function(port) {
		this.app.listen(port);
		this.info("Express server listening.", { port : this.app.address().port } );
		return this;
	};

};

module.exports = new Blog();
