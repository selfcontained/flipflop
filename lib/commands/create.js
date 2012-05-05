var path = require('path'),
	fs = require('fs'),
	moment = require('moment'),
	wrench = require('wrench');

var cmd = module.exports = function() {
	var properties = [
		{
			message : 'Blog title',
			name : 'title',
			validator : /.+/,
			warning : 'anything is better than nothing'
		},
		{
			message : 'Blog description',
			name : 'description'
		}
	];
	app = this;
	cmd.lib.log = app.log.info;

	app.prompt.get(properties, function (err, result) {
		cmd.lib.config.title = result.title;
		cmd.lib.config.description = result.description;

		cmd.lib.blogDir = path.join(
			process.cwd(),
			cmd.lib.config.title.toLowerCase().replace(/\W+/g, '-')
		);

		//confirm destination
		app.prompt.get(	{
			message : 'May I create your blog @ "' + cmd.lib.blogDir + '"?',
			name : 'cool',
			validator : /^[yn]{1}/i,
			warning : 'yes/no'
		}, function(err, result) {
			if(result.cool.charAt(0).toUpperCase() === 'Y') {
				app.log.info('creating blog @ ' + cmd.lib.blogDir);
				cmd.lib.createBlog();
			}else {
				app.log.error("I guess we're done.  No blog for you!");
			}
		});
	});

};
//
// ##cmd.lib
//	expose functionality for testing
// ```
// require('create.js').lib.
// ```
//
cmd.lib = {

	blogDir : null,

	articleDir : null,

	log : function(){},

	config : {
		title : 'flipflip blog',
		description : require('../../package.json').description,
		keywords : [],
		authors : {
			bradharris : {
				name : 'Brad Harris',
				gravatar : 'bmharris@gmail.com',
				github : 'bmharris'
			}
		},
		articles : 'articles'
	},

	createBlog : function() {
		this.articlesDir = path.join(
			this.blogDir,
			this.config.articles
		);

		this.log('creating blog directory: ' + this.blogDir);
		if(path.existsSync(this.blogDir)) wrench.rmdirSyncRecursive(this.blogDir);
		fs.mkdirSync(this.blogDir);

		this.createArticlesDirectory();
		this.createSampleArticle();
		this.createThemeDirectory();
		this.createBlogConfig();
	},

	createArticlesDirectory : function() {
		this.log('creating articles directory: ' + this.articlesDir);
		fs.mkdirSync(this.articlesDir);
	},

	createSampleArticle : function() {
		var dir = path.join(this.articlesDir, 'flipflop-ftw'),
			cfg = require('../samples/article.json'),
			cfgPath = path.join(dir, 'article.json'),
			contentPath = path.join(dir, 'article.md');

		this.log('creating sample article: ' + dir);
		fs.mkdirSync(dir);

		//article config
		this.log('writing file:\t\t' + cfgPath);
		cfg.date = moment().format('MM/DD/YYYY');
		fs.writeFileSync(
			cfgPath,
			JSON.stringify(cfg, null, '\t')
		);

		//article content
		this.log('writing file:\t\t' + contentPath);
		fs.writeFileSync(
			contentPath,
			fs.readFileSync(__dirname+'/../../README.md', 'utf8')
		);
	},

	createThemeDirectory : function() {
		var dest = path.join(this.blogDir, 'theme');
		this.log('creating theme directory:\t\t' + dest);
		wrench.copyDirSyncRecursive(__dirname+'/../theme', dest);
	},

	createBlogConfig : function() {
		var cfgPath = path.join(this.blogDir, 'blog.json');
		this.log('creating blog config:\t\t' + cfgPath);
		fs.writeFileSync(
			cfgPath,
			JSON.stringify(this.config, null, '\t')
		);
	}

};
