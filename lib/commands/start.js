var path = require('path');

var cmd = module.exports = function() {
	cmd.lib.blogDir = process.cwd();
	cmd.lib.log = this.log.info;
	cmd.lib.error = this.log.error;
	cmd.lib.start((this.argv._[1]||8080));
};
cmd.lib = {

	blogDir : null,

	config : null,

	log : function() {},

	error : function() {},

	start : function(port, cb) {
		var self = this;
		this.config = require(path.join(this.blogDir, 'blog.json'));
		this.config.dir = this.blogDir;

		require('../flipflop.js')
			.init(this.config)
			.load(self.config.articles, function(err) {
				if(err) return cmd.lib.error(err);
				this.createApp().listen(port);
				(cb||function(){})();
			});
	}

};
