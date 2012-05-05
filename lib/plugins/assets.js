var less = require('less'),
	fs = require('fs'),
	path = require('path'),
	blog = require('../blog.js'),
	LESS_PATH = path.normalize(__dirname+'/../../theme/css');

function compileCSS(filename, cb) {
	var file = path.join(LESS_PATH, filename),
		lessString = fs.readFileSync(file, 'utf8'),
		css,
		parser;

	parser = new less.Parser({
		filename : file,
		paths: [ LESS_PATH ]
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
		blog.app.get('/css/:filename.css', function(req, res) {
			var filename = req.param('filename')+'.less';

			compileCSS(filename, function(css) {
				res.header('Content-Type', 'text/css');
				res.send(css);
			});
		});
	},

	generate : function(blog, dir) {
		compileCSS('blog.less', function(css) {
			var cssDir = path.join(dir, 'css'),
				cssFile = path.join(cssDir, 'blog.css');
			fs.mkdirSync(cssDir);
			fs.writeFileSync(cssFile, css);
			blog.info('created css file: ', cssFile);
		});

		//copy static resources into destination root
		require('wrench').copyDirSyncRecursive(__dirname+'/../../theme/static', dir);
		blog.info('copied static resources');
	}

};
