#[flipflop][]

## blogs should be easy, like putting on flipflops

It's a node.js library that can both serve a markdown file based blog, and also generate a static site from those files as well. GG.

##Install dependencies

```
> npm install
```

##Run the blog with node.js

For development purposes, it's easier to run the blog as a node.js http server.  Template/CSS changes are picked up automatically, but new/modified articles require a restart.

```
> node server.js
```

##Generate a static site

A static version of the blog can be created as well.  This outputs simple html and css, and can be hosted anywhere without a need for any dependencies.  By default the site is output in a folder called ```public```

```
> node generate.js
```

##Blog Config
High level blog config is found in ```./blog.json```.  The location and name of this are just a convention and can be specified in ```./generate.js``` and ```./server.js```.

```javascript
{
	"title" : "selfcontained",
	"description" : "Blog on software developlment by Brad Harris",
	"keywords" : [
		"software",
		"web development",
		"brad harris"
	],
	"authors" : {
		"bradharris" : {
			"name" : "Brad Harris",
			"gravatar" : "bmharris@gmail.com",
			"github" : "bmharris"
		}
	}
}
```

##Articles

Articles are simply folders in the ```articles``` folder that contain two files:

+	article.md
+	article.json

###article.md

This file is the article, and can be formatted with Github flavored markdown.

###article.json

This is a config file for meta-data associated with the article.  It should look as follows:

```
{
	"title": "node.js clusters",
	"author": "bradharris",
	"date": "2012-04-04 16:59:34",
	"publish": true,
	"tags": ["node.js", "javascript"]
}
```
The properties should be pretty self-explanatory.

+	```author``` maps to the 'authors' property in the blog config file ```/blog.json```, which is where meta-deta about the author is stored.
+	```publish``` can be true/false.  If false, they won't be available or generated for the site.
+	```date``` should be formatted as a string Date.parse can handle correctly

##Theme

The theme of the blog is easily configured under the ```theme``` folder.  Templates are in [jade][], and can be modified as desired.

All CSS files are [LESS][].  Currently the only file generated for the static site is ```blog.less```


[selfcontained.us]: http://selfcontained.us
[jade]: http://jade-lang.com
[LESS]: http://lesscss.org
