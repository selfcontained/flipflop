var less = require('less'),
	fs = require('fs'),
	path = require('path'),
	wrench = require('wrench');

function compileCSS(filename, lessPath, cb) {
	var file = path.join(lessPath, filename),
		lessString = fs.readFileSync(file, 'utf8'),
		css,
		parser;

	parser = new less.Parser({
		filename : file,
		paths: [ lessPath ]
	});
	parser.parse(lessString, function(e, tree) {
		if(e) cb(e.toString());
		try {
			css = tree.toCSS({compress:true});
		}catch(e) {
			css = e.toString();
		}
		cb(css);
	});
}

module.exports = {

	register : function(blog) {
		var lessPath = path.join(blog.dir, 'theme', 'css');

		blog.app.get('/css/:filename.css', function(req, res) {
			var filename = req.param('filename')+'.less';

			compileCSS(filename, lessPath, function(css) {
				res.header('Content-Type', 'text/css');
				res.send(css);
			});
		});
	},

	generate : function(blog, dir) {
		var lessPath = path.join(blog.dir, 'theme', 'css');

		compileCSS('blog.less', lessPath, function(css) {
			var cssDir = path.join(dir, 'css'),
				cssFile = path.join(cssDir, 'blog.css');
			fs.mkdirSync(cssDir);
			fs.writeFileSync(cssFile, css);
			blog.info('created css file:\t', cssFile);
		});

		//copy static resources into destination root
		wrench.copyDirSyncRecursive(
			path.join(blog.dir, 'theme/static'),
			dir
		);
		blog.info('Copied static files:\t', dir);
	}

};
