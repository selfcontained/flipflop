var fs = require('fs'),
	path = require('path'),
	vows = require('vows'),
	assert = require('assert'),
	moment = require('moment'),
	request = require('request'),
	port = 9999,
	config;

vows.describe('flipflop')

	.addBatch({

		'When using `flipflop create`' : {

			topic : function() {
				this.lib = require('../lib/commands/create').lib;
				this.lib.blogDir = __dirname+'/artifacts';
				this.lib.createBlog();
				config = this.lib.config;
				this.callback();
			},

			'blog directory exists' : function() {
				assert.isTrue(fs.existsSync(this.lib.blogDir));
			},
			'articles directory exists' : function() {
				assert.isTrue(fs.existsSync(this.lib.articlesDir));
			},
			'theme directory exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.blogDir, 'theme')));
			},
			'blog.json config file exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.blogDir, 'blog.json')));
			},
			'sample article exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.articlesDir, 'flipflop-ftw')));
			},
			'blog title is correct' : function() {
				assert.equal(this.lib.config.title, require('./artifacts/blog.json').title);
			},
			'blog description is correct' : function() {
				assert.equal(this.lib.config.description, require('./artifacts/blog.json').description);
			}
		}
	})
	.addBatch({

		'When using `flipflop generate`' : {

			topic : function() {
				this.lib = require('../lib/commands/generate').lib;
				this.lib.blogDir = __dirname+'/artifacts';
				this.lib.generate(this.callback);
			},

			'public directory exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.blogDir, 'public')));
			},
			'archive exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.blogDir, 'public', 'archive', 'index.html')));
			},
			'feed exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.blogDir, 'public', 'feed', 'rss.xml')));
			},
			'404 page exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.blogDir, 'public', '404.html')));
			},
			'images directory exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.blogDir, 'public', 'images')));
			},
			'tag directory exists' : function() {
				assert.isTrue(fs.existsSync(path.join(this.lib.blogDir, 'public', 'tag')));
			},
			'sample article exists' : function() {
				var article = path.join(
					this.lib.blogDir,
					'public',
					moment().format('YYYY/MM/DD'),
					'flipflop-ftw',
					'index.html'
				);
				assert.isTrue(fs.existsSync(article));
			}
		}
	})
	.addBatch({

		'When using `flipflop start`' : {

			topic : function() {
				this.lib = require('../lib/commands/start').lib;
				this.lib.blogDir = __dirname+'/artifacts';
				this.lib.start(port, this.callback);
			},

			'and requesting homepage' : {

				topic : function() {
					request.get('http://localhost:'+port+'/', this.callback);
				},

				'has response' : function(err, response, body) {
					assert.isNull(err);
					assert.equal(200, response.statusCode);
				},
				'body is correct' : function(err, response, body) {
					assert.isNull(err);
					assert.notEqual(-1, body.indexOf('<title>'+config.title+'</title>'));
				}
			},

			'and requesting archive' : {

				topic : function() {
					request.get('http://localhost:'+port+'/archive/', this.callback);
				},

				'has response' : function(err, response, body) {
					assert.isNull(err);
					assert.equal(200, response.statusCode);
				},
				'body is correct' : function(err, response, body) {
					assert.isNull(err);
					assert.notEqual(-1, body.indexOf('<title>archive - '+config.title+'</title>'));
				}
			},

			'and requesting feed' : {

				topic : function() {
					request.get('http://localhost:'+port+'/feed/rss.xml', this.callback);
				},

				'has response' : function(err, response, body) {
					assert.isNull(err);
					assert.equal(200, response.statusCode);
				},
				'body is correct' : function(err, response, body) {
					assert.isNull(err);
					assert.notEqual(-1, body.indexOf('<channel><title>'+config.title+'</title>'));
					assert.notEqual(-1, body.indexOf(config.domain));
				}
			}

		}
	})

	.export(module);
