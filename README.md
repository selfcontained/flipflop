[![Build Status](https://secure.travis-ci.org/bmharris/flipflop.png?branch=master)](http://travis-ci.org/bmharris/flipflop)

#flipflop

## ezmode geek blogging, like wearing sandals

It's a node.js library that can both serve a markdown file based blog, and also generate a static site from those files as well. [GG][].

+	**[markdown][]** - articles are stored in markdown formatted text files.
+	**[jade][]** - the theme can be customized via jade templates & [less][]
+	run it from a [node.js http server](#start-er-up), or [generate a static site](#static-sites-are-hawt) that you can host pretty much anywhere and not worry about dependencies.

---

##Installation

**flipflop** provides a cli interface so needs a global install

```
> npm install -g flipflop
```

##Create a new blog

```
> flipflop create
```

This starts a cli app that will prompt for a few bits of info about your blog, and create a directory for it in the `process.cwd()`.

##Start 'er up

Make sure you're inside your blog's directory.

```
> flipflop start <port>
```
check your browser @ `http://localhost:8080`
+	port is optional, defaults to 8080

##Static sites are hawt

Also, from inside your blog's directory.

```
> flipflop generate
```

This will create a static version of your site in a `public` folder within your blog's directory

##Config

Generating a blog with `flipflop create` produces a `blog.json` file in your blog's root directory.  Customize it as you want.

```javascript
{
	"title": "flipflip blog",
	"description": "ezmode geek blogging, like wearing sandals",
	"keywords": [],
	"authors": {
		"bradharris": {
			"name": "Brad Harris",
			"gravatar": "bmharris@gmail.com",
			"github": "bmharris"
		}
	},
	"articles": "articles",
	"domain": "http://yourdomain.com",
	"routes": {
		"archive": "/archive",
		"article": "/:year/:month/:day/:slug",
		"error": "/404.html",
		"homepage": "/",
		"feed": "/feed/rss.xml",
		"tag": "/tag/:tag"
	}
}
```
###Options
Many of these properties are used within the blog's template files.

+	`title` the title of your blog
+	`description` the description of your blog
+	`keywords` array of keywords describing your blog, used for the `<meta name="keyword"/>` tag
+	`authors` key/value object containing article authors' information.  This is used to display information about an article's author on the associated article page.
+	`articles` location of directory containing articles.  This defaults to a location relative to your blog's directory but can be absolute as well.
+	`domain` used for creating absolute paths for your blog's feed
+	`routes` allow a user to configure the urls

## Configuring Routes / Urls

You can configure urls for yuor blog via the `routes` property in the `blog.json` config file.  For example, if you wanted to prefix your blog with **/blog/**, you can do the following:

```javascript
"routes": {
	"archive": "/blog/archive",
	"article": "/blog/:year/:month/:day/:slug",
	"error": "/blog/404.html",
	"homepage": "/blog",
	"feed": "/blog/feed/rss.xml",
	"tag": "/blog/tag/:tag"
}
```

If **.html** extensions are what you live for, you could change your **article** route to look like:

```javascript
"article": "/:year/:month/:day/:slug.html"
```

There are a few special things to note with routes:

+ The **article** route requires a `:slug` param.  Available params are:
	+ `:year`
	+ `:month`
	+ `:day`
	+ `:slug` (required)
+ The **tag** route requires a `:tag` param.  Available params are:
	+ `:tag` (required)

---

##Write some articles

There will soon be a cli command to generate a new article for you, but you can always create them manually.  Simply create a folder inside your blog's `articles` folder.  Whatever you name the folder will be used as the slug for the url (in combination with the article's date), so keep the folder url friendly.  Populate it with an `article.json` file and an `article.md` file.

```
- some-post
	- article.json
	- article.md
```

###article.json

```
{
	"author": "bradharris",
	"title": "flipflop ftw",
	"date": "05/04/2012",
	"publish": true,
	"tags": [
		"flipflop",
		"javascript",
		"node.js"
	]
}
```
###Options
+	`author` should be a key that maps to the blog config `authors` object
+	`title` title of the post, doesn't need to be url friendly
+	`date` date the article was published - a string Date.parse can handle correctly
+	`publish` true/false - if false the article won't be accessible/generated
+	`tags` array containing tags describing the article.

###article.md

Not much to describe here, just a markdown formatted file containing your article.  **flipflop** uses [marked][] to process markdown files, which supports [GitHub Flavored Markdown][gfm].

##Contributing

I'm happy to accomodate pull requests and bug reports, so fork it and improve it or [let me know if you find any issues][issues].

## License

(The MIT License)

Copyright (c) 2013 Brad Harris

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[GG]: http://www.urbandictionary.com/define.php?term=gg
[markdown]: http://daringfireball.net/projects/markdown/
[jade]: https://github.com/visionmedia/jade/
[less]: http://lesscss.org/
[marked]: https://github.com/chjj/marked
[gfm]: http://github.github.com/github-flavored-markdown/
[issues]: https://github.com/selfcontained/flipflop/issues
