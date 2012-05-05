var path = require('path');

var cmd = module.exports = function() {
	var app = this;

	cmd.lib.blogDir = process.cwd();
	cmd.lib.log = app.log.info;
	cmd.lib.error = app.log.error;
	cmd.lib.generate();
};
cmd.lib = {

	blogDir : null,

	config : null,

	log : function() {},

	error : function() {},

	generate : function(cb) {
		var config = require(path.join(this.blogDir, 'blog.json'));
		config.dir = this.blogDir;

		require('../flipflop')
			.init(config)
			//TODO: article path needs to not assume relative
			.load(path.join(cmd.lib.blogDir, config.articles), function(err) {
				if(err) return cmd.lib.error(err);
				this.generate(path.join(cmd.lib.blogDir, 'public'));
				(cb||function(){})();
			});
	}

};
