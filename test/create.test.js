var path = require('path'),
	vows = require('vows'),
	assert = require('assert'),
	lib = require('../lib/commands/create.js').lib;

vows.describe('flipflop').addBatch({

	'When using `flipflop create`' : {

		topic : function() {
			lib.blogDir = __dirname+'/artifacts';
			lib.createBlog();
			this.callback();
		},

		'blog directory exists' : function() {
			assert.isTrue(path.existsSync(lib.blogDir));
		},
		'articles directory exists' : function() {
			assert.isTrue(path.existsSync(lib.articlesDir));
		},
		'theme directory exists' : function() {
			assert.isTrue(path.existsSync(path.join(lib.blogDir, 'theme')));
		},
		'blog.json config file exists' : function() {
			assert.isTrue(path.existsSync(path.join(lib.blogDir, 'blog.json')));
		},
		'sample article exists' : function() {
			assert.isTrue(path.existsSync(path.join(lib.articlesDir, 'flipflop-ftw')));
		},
		'blog title is correct' : function() {
			assert.equal(lib.config.title, require('./artifacts/blog.json').title);
		},
		'blog description is correct' : function() {
			assert.equal(lib.config.description, require('./artifacts/blog.json').description);
		}
	}

}).export(module);
