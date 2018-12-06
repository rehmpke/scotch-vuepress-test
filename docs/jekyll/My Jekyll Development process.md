---
created: 2016-08-26 17:28:57 +0000
source: Clearly
source-url: https://mademistakes.com/articles/using-jekyll-2016/
updated: 2017-12-02 17:01:59 +0000
title: My Jekyll Development process
---

# How I’m Using Jekyll in 2017

I first started using [Jekyll](http://jekyllrb.com/) — a static site generator, back in 2012. In the four years since, it has indirectly introduced me to a host of new tools and ways of building websites. Hell, I wasn’t even using version control when developing this site — so you know a lot has changed.

What follows is a brain dump documenting my approach to using Jekyll, how that’s evolved over the years, and any other learnings I’ve picked up along the way. This is mostly an excuse for me to capture and reflect on things, but maybe you’ll find some useful nuggets in the mess that’s sure to follow.

## Converting and Restructuring Content

To learn how Jekyll works I set off on a journey to turn a [Wordpress](https://wordpress.org/) powered site into the static version you see now. I read several tutorials, learned Kramdown`[1]`(https://mademistakes.com/articles/using-jekyll-2016/#fn:kramdown) and [Liquid](https://docs.shopify.com/themes/liquid-documentation/basics), [blogged about the process](https://mademistakes.com/articles/going-static/), and eventually ended up with something I was happy with — all without a database or CMS.

### Posts for All the Things

As Jekyll has matured and added features, the complexity at which I use it has too. In those early days, content could only be considered a **post** or **page**. Posts became more valuable to me than pages since they could reap the benefits of `site.tags` and `site.categories` for creating archives and as a way to surface “related content”.

Posts made a lot of sense then because the only type of content I had on the site were blog posts. As I started incorporating things like portfolio pieces into the site I used categories as a way to structure content by “post type.” For example, [Blog Articles](https://mademistakes.com/articles/) would `get categories: articles` added to their `YAML` Front Matter and `permalink: /:categories/:title/ in \_config.yml` to produce pretty URLs like `/articles/jekyll-is-the-best/`.

A drawback I hit with this method was reliable pagination between posts. Jekyll provides the variables `page.previous` and `page.next` to help create previous/next style links between posts. But because I was trying to section off posts by category, these links didn’t always behave as expected.

For example, when reading a post in the `articles` category, I’d expect the **NEXT →** link to show the next article post. Instead, something from the `portfolio` category came up because it was the next item in the `site.posts` array. With plugins or a messy bit of Liquid you could probably filter on the current category and get around this, but I never took it that far.

Details like this drive me bonkers, so instead I opted for a **You May Also Enjoy** module that displays three related posts (with the help of a plugin`[2]`(https://mademistakes.com/articles/using-jekyll-2016/#fn:related-posts)) at the bottom of the page. In my eyes, this provided a better reading experience even if my site took longer to generate at build…

|Jekyll version|Build time|Posts||
|---|---|---|---|
|Then|0.12.1|< 1s|25|
|Now|3.1.1|121.62s|980|

It’s no coincidence that my build times went from under a second to a few minutes as I hit almost 1,000 posts. Moving to solid-state drives and reducing the amount of Liquid for loops in my layouts and includes has helped — but I still have ways to go if I want to speed things up further.

The new **`--incremental` regeneration** feature will eventually play a big role in speeding things up. On a default `jekyll new` site it works really well, but unfortunately I haven’t had much luck getting it to play nicely with the plugins I use. Work currently being done on this feature seems like its [going in the right direction](https://github.com/jekyll/jekyll/pull/4269), so I’m sure in time things will sort out.

For now the best I can do is use the new **Liquid Profiler**`[3]`(https://mademistakes.com/articles/using-jekyll-2016/#fn:profiler) to identify problematic bits and simplify where I can. I add new content so infrequently that it really isn’t a bother waiting 2 minutes for a build to finish, but damn it would be nice to hit < 1s again!

![](/My%20Jekyll%20Development%20process.resources/E3358A27-EBB0-4FEA-B37E-CC21304FCDBF.png)

jekyll build --profile in action.

### Collections

When [collections](http://jekyllrb.com/docs/collections/) were introduced back in v2.0, I decided to build out a [Frequently Asked Questions](https://mademistakes.com/faqs/) section on my site to familiarize myself with the feature.

Creating a collection of FAQ items turned out to be easier than expected. Make a `_faqs` directory populated with Markdown-formatted text files (like any other post or page), configure the collection in `_config.yml`, build an [index page](https://github.com/mmistakes/made-mistakes-jekyll/blob/master/_pages/faqs/index.md) to display all of the collection’s documents, and done!

    # _config.yml

    collections
      faqs:
        output: true
        permalink /:collection/:path/
        title: FAQs

As collections have elevated in status they’re increasingly becoming my preferred way of working with static content. In addition to the FAQs collection I’ve also created one to build a “[living style guide](https://mademistakes.com/articles/jekyll-style-guide/)” of sorts — documenting the look and feel of the site with visual representations and code samples.

Eventually I plan to convert more posts into their own collections. Posts currently categorized as work seem like the obvious choice since its always felt funny shoe-horning them into `_posts`. As far as others? Not sure yet.

What I’d like to investigate deeper is adding taxonomies to collections and how they mingle with the tags and categories already in `site.posts`. I’m not exactly sure if they coexist with `site.tags` or how [tag archives](https://mademistakes.com/tag/) generated by [Jekyll Archives](https://github.com/jekyll/jekyll-archives) might see them. A job best saved for a rainy day I suppose…

### Pages for Everything Else

Content that doesn’t need to be ordered chronologically or grouped in any way becomes a **page**. To keep things nice and tidy I place all of the source `.md` or `.html` files into a `_pages` directory and assign permalink overrides in the YAML Front Matter of each.

An architecture like this helps centralize the content so you’re not poking around trying to locate files. Meaningfully naming files should be the goal. Avoid patterns like `/about/index.md` as it makes distinguishing between multiple `index.md` files harder.

    project-name/
    ├── \_assets/
    ├── \_data/
    ├── \_drafts/
    ├── \_includes/
    ├── \_layouts/
    ├── \_pages/
    | ├── 404.md # custom 404 page
    | ├── about.md # about page
    | ├── contact.md # contact page
    | └── home.md # home page (eg.    <root>/index.html)
    ├── \_posts/
    ├── .gitignore
    ├── \_config.yml
    └── Gemfile

And then in each Markdown file I set a permalink that fits in with the format used on the rest of the site.

Examples: `about.md ~> permalink: /about/, home.md ~> permalink: /, contact.md ~> permalink: /contact/, etc.`

> #### ProTip: Include Your Pages Directory
>
>To be sure Jekyll “sees” and processes the files inside of \_pages, be sure to include it. Add include: \["\_pages"\] to \_config.yml and you should be good to go.

## An Evolution

From a workflow perspective, things have mostly stayed the same. I still “write in Markdown”, build this site locally, and push the contents of the `_site` directory to a web server. On the development side, however, complexities have been introduced in an effort to optimize and improve website performance.

Tinkering and experimenting with the visual design of Made Mistakes whenever I want is important to me. Since I work on both Mac OS X and Windows based devices I need tooling that plays nicely with each. Below are the tools, configurations, and Jekyll plugins that help do that.

### Bundler

Installing Ruby, Bundler, and Ruby Gems were all new to me four years ago. Running `jekyll build` on different operating systems felt like a crap shoot. A setup that worked one day would most certainly break the next after updating Jekyll on a Windows machine.

I eventually learned to embrace [Bundler](http://bundler.io/) from the advice of numerous Stack Overflow threads and GitHub issues. Since Bundler is the official way to install Jekyll it wasn’t that big of a leap for me to start using a `Gemfile` to manage all dependencies. To do that:

1. Run `bundle init` to create an empty `Gemfile`
1. Add gem `'jekyll'` and any other gems to the `Gemfile`.

        # Made Mistakes example Gemfile

        source 'https://rubygems.org'

        gem 'breakpoint'
        gem 'wdm' '~> 0.1.0' win_platform?
        gem 'mini_magick'
        gem 'autoprefixer-rails'
        gem 'uglifier'

        \# Jekyll and Plugins
        'jekyll'
        'jekyll-archives'
        'jekyll-tagging-related_posts'
        group :jekyll_plugins
        'jekyll-assets' github: 'jekyll/jekyll-assets'
        'jekyll-sitemap' github: 'jekyll/jekyll-sitemap'

Now when running `bundle install` each of the gems specified above are installed and a `Gemfile.lock` is created listing all of the dependencies. Prepending all Jekyll commands with bundle `exec` ensures only the versions in `Gemfile.lock` are executed helping to mitigate conflicts.

Committing both of these Gemfiles to a git repository also makes it easy to revert back if a `gem update` goes bad. Sure it’s a few more characters to type, but the headaches it solves are more than worth it. You can even write shortcut tasks with Rakefiles to eliminate the extra keystrokes — if automation is your thing (more on that below).

### Environments and Configurations

With the introduction of asset related plugins and various other build steps, I eventually settled on two Jekyll configuration files. A default `_config.yml` with production settings and `_config.dev.yml` for development specific ones.

The cool thing is you can chain together these configuration files, overriding settings from the previous. For example, when building locally I’d like ```{{ site.url }}``` and ```{{ site.disqus-shortname }}``` to default to their development equivalents for testing purposes. Adding the following values to `_config.dev.yml` overrides the ones in `_config.yml`:


The cool thing is you can chain together these configuration files, overriding settings from the previous. For example, when building locally I’d like ```{{ site.url }}``` and ```{{ site.disqus-shortname }}``` to default to their development equivalents for testing purposes. Adding the following values to `_config.dev.yml` overrides the ones in `_config.yml`:

    url: http://localhost:4000
    disqus-shortname: mmistakes-dev

A development server can then be fired up with the relevant settings using…

```bash
bundle jekyll serve --config \_config.yml,\_config.dev.yml
```

Going one step further a Jekyll environment can be specified as well. By default Jekyll runs in development with a value of `JEKYLL_ENV=development`. The [compress.html](https://github.com/mmistakes/made-mistakes-jekyll/blob/master/_layouts/compress.html) layout and [Jekyll-Assets](https://github.com/jekyll/jekyll-assets) plugin both make use of this triggering HTML, CSS, and JavaScript compression with the following command:

    JEKYLL_ENVproduction bundle jekyll build

> #### Windows Environment Gotcha
>
> On Windows I had issues minifying when JEKYLL_ENV=production bundle exec jekyll build silently failed. Instead, I found that the [SET](http://ss64.com/nt/set.html) command had to be used to assign environment variables.

    JEKYLL_ENVproduction

#### Other Configurations

As mentioned earlier I have a moderately sized Jekyll site at 991 posts. Combine that fact with an /images/ directory that is close to 2 GB, a liberal use of Liquid for loops, and generator plugins like [Jekyll Archives](https://github.com/jekyll/jekyll-archives) — you get site builds that are far from instant. And in the rare cases when I run `jekyll clean` to flush caches and everything in `/\_site/`, builds can take over 15 minutes as the [Jekyll Picture Tag](https://github.com/robwierzbowski/jekyll-picture-tag) plugin regenerates appropriately sized hero images for every posts. Yikes!

So as you might have guessed, I sure as hell never start up a server with *auto-regeneration* enabled. Instead, I start with `bundle exec jekyll serve --no-watch` and then run a rake task to manually build every time I want to check changes locally.

When working on the site’s design it can be cumbersome to sit through a 2 minute build just to check a CSS change. But until `--incremental` works reliably its something I have to suffer through (or use plugins to isolate posts at build). Its a good thing I do a lot of my ‘designing’ in-browser with [Chrome’s DevTools](https://developer.chrome.com/devtools) before editing the actual source as this hasn’t been too annoying.

### Automation Tools and Shortcuts

To save time (and my sanity) when working on the site locally, I employee a few tools to perform common development related tasks.

#### Grunt

[Grunt](http://gruntjs.com/) describes itself as “the JavaScript task runner.” Grunt has a fairly large set of plugins that can handle pretty much any mundane task you through at it.

Prior to Jekyll natively supporting Sass I used Grunt plugins to pre-process `.less` files, concatenate a set of JavaScript files, and optimize image assets. Now that I’m running Jekyll 3.1 and the Jekyll-Assets plugin I no longer need Grunt to mess with my scripts and stylesheets.

These days I use Grunt solely for optimizing images and `SVGs` with the following plugins:

    // Grunt plugins in package.json
    "devDependencies": {
      "grunt" "~0.4.2",
      "grunt-newer" "^0.7.0",
      "grunt-imgcompress" "~0.1.1",
      "grunt-svgmin" "~0.3.1",
      "grunt-svgstore" "^0.5.0"
    }

When I add new `JPEG` or `PNG` assets to `/images/` I use the following command to optimize them — reducing their file size and speeding up page loads.

    grunt images

On the SVG side of things any files added to /\_svg/ are optimized and merged into a [single sprite map](https://css-tricks.com/svg-sprites-use-better-icon-fonts/) with the following command:

    grunt svg

In combination with both of these tasks I use the [grunt-newer](https://www.npmjs.com/package/grunt-newer) plugin. This dramatically speeds up things as only new and modified files are processed.

On the build and deployment side of things I have a few shortcut tasks defined in Rakefile.rb. As mentioned earlier typing out bundle exec before Jekyll commands can get old fast. Instead, I use the following:

##### Start up a Jekyll server

rake serve

##### Production Build, Development Build, and Build with Drafts

rake build
<br>rake build:dev
<br>rake build:drafts

##### Deployment

Since I self-host my site I need a way of pushing the contents of the /\_site/ directory after a production build. Years ago I’d use [Cyberduck](https://cyberduck.io/) or [FileZilla](https://filezilla-project.org/) to transfer everything over slowly to [Media Temple](http://bit.ly/1Ugg7nN) via FTP.

These days I use rsync to speed that transfer way the hell up, sending only new and modified files. It’s also a task that I can automate by adding the following to my [Rakefile.rb](https://github.com/mmistakes/made-mistakes-jekyll/blob/master/Rakefile.rb) file.

\# Usage: rake rsync

"rsync the contents of ./\_site to the server"
<br>:rsync
<br>"\* rsyncing the contents of ./\_site to the server"
<br>system "rsync --perms --recursive --verbose --compress --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \_site/ SSHuser@mydomain.com"

As part of my deployment process I also run tasks that notify [Ping-O-Matic](http://pingomatic.com/), Google, and Bing that the site has been updated and to index the [sitemap.xml](https://mademistakes.com/sitemap.xml) and [atom.xml](https://mademistakes.com/atom.xml) feeds. These tasks look something like this:

\# Usage: rake notify
<br>:notify => "notify:pingomatic" <br>"notify:google" "notify:bing"
<br>"Notify various services that the site has been updated"
<br>namespace :notify

"Notify Ping-O-Matic"
<br>:pingomatic
<br>begin
<br>require 'xmlrpc/client'
<br>"\* Notifying Ping-O-Matic that the site has updated"
<br>XMLRPCClient'rpc.pingomatic.com' <br>'weblogUpdates.extendedPing' 'mydomain.com' '//mydomain.com' '//mydomain.com/atom.xml'
<br>rescue LoadError
<br>"! Could not ping ping-o-matic, because <br>XMLRPC::Client could not be found."

"Notify Google of updated sitemap"
<br>:google
<br>begin

require 'net/http'

require 'uri'

"\* Notifying Google that the site has updated"

'www.google.com' '/webmasters/tools/ping?sitemap=' escape'//mydomain.com/sitemap.xml'

rescue LoadError

"! Could not ping Google about our sitemap, because Net::HTTP or URI could not be found."

"Notify Bing of updated sitemap"

:bing

begin

require 'net/http'

require 'uri'

'\* Notifying Bing that the site has updated'

'www.bing.com' '/webmaster/ping.aspx?siteMap=' escape'//mydomain.com/sitemap.xml'

rescue LoadError

"! Could not ping Bing about our sitemap, because Net::HTTP or URI could not be found."

And with a simple rake deploy I can build a production-ready version of the site, rsync everything over to my web host, and notify search engines there’s new content to crawl.

### Asset Pipeline

Originally I wrote my stylesheets in [Less](http://lesscss.org/)[4](https://mademistakes.com/articles/using-jekyll-2016/#fn:less) and squished them down with a Grunt task. Then one day Jekyll grew up and started supporting Sass files natively so I converted everything over and was able to remove a dependency. Hooray!

Not content with that workflow I eventually leveled-up by incorporating the [Jekyll-Assets](https://github.com/jekyll/jekyll-assets) plugin into the mix. It’s a powerful gem with an assortment of tags that make cache busting and inlining assets (something I’ll get to in a minute) so much easier.

It also supports the wonderful [PostCSS](http://postcss.org/) plugin [Autoprefixer](https://github.com/postcss/autoprefixer), for automatically adding vendor prefixes to CSS rules. CSS declarations like this:

.post\_\_content

display

flex-direction column

flex-wrap nowrap

margin-top

Get properly prefixed without any additional effort…

.post\_\_content

display -webkit-box

display -webkit-flex

display -ms-flexbox

display

\-webkit-box-orient vertical

\-webkit-box-direction normal

\-webkit-flex-direction column

\-ms-flex-direction column

flex-direction column

\-webkit-flex-wrap nowrap

\-ms-flex-wrap nowrap

flex-wrap nowrap

margin-top

Even better, when browsers don’t need this extra prefixed nonsense — Autoprefixer will leave it out based on the browsers: set in my Jekyll config.

For this site I target the last 2 versions of each major browser, browsers that have a global usage of over 5%, or are Internet Explorer 9+.

\# \_config.yml

assets

autoprefixer

browsers versions"

### Page Speed Optimizations

### Critical Path CSS

To speed up page loads I’ve gone to the trouble of [inlining the critical CSS](https://www.smashingmagazine.com/2015/08/understanding-critical-css/) needed to render a page. I didn’t use any fancy tools to determine what was critical but instead structured my SCSS partials in a way that the important visual stuff comes first.

With a focus on modular CSS, I can build critical and non-critical flavors by @import-ing the bits needed for each fairly easily. Using the Jekyll-Assets asset_source tag[5](https://mademistakes.com/articles/using-jekyll-2016/#fn:assets-tag-example) to output the contents of [critical.scss](https://github.com/mmistakes/made-mistakes-jekyll/blob/master/_assets/stylesheets/critical.css.scss) into the <head> of ever page and a bit of JavaScript to [asynchronously load the non-critical stuff](https://github.com/filamentgroup/loadCSS).

![](My%20Jekyll%20Development%20process.resources/3169D2CD-85B6-47CA-919E-F5EF06714376.jpg)

Page speed analyzed with [Google’s PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) tool.

#### ProTip: Plugin-Free Inlined Critical CSS

A similar method can be achieved by placing a SCSS file inside the /\_includes/ directory and applying the scssify filter. Perfect for sites hosted on GitHub Pages where most plugins aren’t allowed.

<head>

<style type="text/css">

capturecriticalcss

includecritical

endcapture

criticalcssscssify

</style>

</head>

#### Responsive Images Revisited

Inlining the above the fold CSS and lazy loading the rest wasn’t the only site performance improvement I’ve made. The biggest hurdle I’ve come across working with Jekyll is image management. Since Jekyll isn’t a CMS and I have thousands of image assets, finding a solution to [serve them responsively](http://alistapart.com/article/responsive-images-in-practice) has been challenging.

Since day one I’ve been trying to get closer to this [dream scenario](https://github.com/jekyll/jekyll-assets/issues/172):

1.  Link images in a post/page with just Markdown (e.g. !\[image\](image-name.jpg)).
2.  Automatically generate smaller sizes (perhaps specified in \_config.yml).
3.  <img> elements are spit out with the correct srcset and sizes markup.

To my knowledge there are no Jekyll plugin that do this, though some get close — [Jekyll-Picture-Tag](https://github.com/robwierzbowski/jekyll-picture-tag), [Jekyll-Responsive-Image](https://github.com/wildlyinaccurate/jekyll-responsive-image), [Jekyll-Srcset](https://github.com/netlify/jekyll-srcset). Jekyll-Picture-Tag does most of what I want (automatically size images from presets) with tags like pictureimage.jpg, which means I have to forgo linking to images with plain Markdown for now.

When setting up the plugin I focused in on the large hero images and decided to worry about the others later. Replacing Markdown images with picture tags for 1,000 posts just isn’t feasible yet. Since the hero images are Liquid driven they proved much easier to implement.

All it took was changing <img src="{{ page.image.feature }}" alt=""> to picturepage.image.feature and settling on this configuration:

picture

source images/\_originals"

output images"

markup picture"

presets

class page\_\_hero-image"

itemprop image"

source_1600

media (min-width:1600px)"

width 1600"

source_1024

media (min-width:1024px)"

width 1024"

source_768

media (min-width:768px)"

width

source_600

media (min-width:600px)"

width

source_default

width

Now when a high resolution image is placed in /images/\_originals/ and feature: image.jpg added to the YAML Front Matter of a page, this markup spits out automatically:

<picture>

<source srcset="image-1600.jpg" media="(min-width: 1600px)"

<source srcset="image-1024.jpg" media="(min-width: 1024px)"

<source srcset="image-768.jpg" media="(min-width: 768px)"

<source srcset="image-600.jpg" media="(min-width: 600px)"

<source srcset="image-320.jpg"

<img "image-320.jpg" class="page\_\_hero-image" itemprop="image"

</picture>

By default, the plugin hashes the filenames, but [I disabled that](https://github.com/mmistakes/made-mistakes-jekyll/commit/39fcf74b99d5fd6988eaff332ce90208c57ed840) since it was getting hard to manage between Mac OS X and Windows environments (each created their own hashed version of the file even when visually the same).

Currently, this plugin only supports the <picture> element which is great for art directed responsive images, but a bit overkill in this case. Having the option to use srcset instead would be preferred, but since I’m not a Rubyist making that change to the plugin is out of my hands until [someone else tackles it](https://github.com/robwierzbowski/jekyll-picture-tag/issues/68).

![](My%20Jekyll%20Development%20process.resources/3F92F9B7-ACD1-4C7F-BF97-7358B9D55BE8.jpg)

The bump in page speed has been great with a mobile score of 73/100 improving to 96/100.

The one big drawback I’ve experienced using this plugin has been an increase in build times. If I don’t instruct Jekyll to keep_files: \["images"\], every time I run Jekyll over 1,000 images will go through the process of being resized into smaller files. This takes forever and even longer when uploading them all to my web server (another reason I disabled MD5 hashed filenames). Baby steps right?

### A Focus on Content

Showcasing a post or page’s content is still the primary goal of the layouts I designed years ago. It’s been a balancing act as I’ve tried to incorporate navigation systems (main menu, table of contents, page breadcrumbs, tag archives), reader submitted comments, related posts, and social sharing links in complimenting and responsive ways.

![](My%20Jekyll%20Development%20process.resources/686E1675-87F9-41AB-B7F3-DF8D3D326CE2.jpg)

![](My%20Jekyll%20Development%20process.resources/DC276F49-CF16-4E71-B996-AFC9583AD2A3.jpg)

(Left) post layout then, (right) post layout now.

The core elements have remained unchanged since I originally launched the site:

1.  A neutral design to avoid competing with page content (text and image).
2.  Well defined structure, way points for navigating the site, and related content to encourage deeper browsing.
3.  Readable typography to help showcase long-form articles and tutorials.

Building everything from scratch has really given me the chance to focus on all of these points. It’s also helped me avoid the trap of adding useless widgets and other cruft because they’re trivial to install — something I was guilty of when using plug and play software like [Wordpress](https://wordpress.org/).

The challenge has been finding ways to surface related content and displaying them in an attractive manner. I wanted to take a simple text list of posts and turn them into something more visual. With the thought that no one was going to sift through a bunch of boring text unless there were images to break up things.

#### Listing Posts

Archive page layouts I’ve designed over the years have gone through several incarnations. I went from plain text lists, to thumbnail images, to listings with a short excerpt, to something that combined them all.

![](My%20Jekyll%20Development%20process.resources/C218FCB5-1B8F-4500-A48A-D7B72AA067D2.png)

![](My%20Jekyll%20Development%20process.resources/80F2B657-745B-48DC-A878-0D9CC927F49C.png)

Title/excerpt versus image/date/title/excerpt post lists.

What I’m currently using are tiles for related and featured post modules and a more traditional plain list for archive pages.

![](My%20Jekyll%20Development%20process.resources/5D38BB68-4B40-46C1-ADCC-A3587EE9132A.jpg)

Archive listing with teaser image, headline, published date, estimated reading time, and excerpt.

Related posts are dynamically pulled from site.related_posts and augmented with a [Jekyll plugin](https://github.com/toshimaru/jekyll-tagging-related_posts) to make matches based on post.tags. The following tile logic resides in an include file and is ready to be used in layouts or within post/page content.

<!-- /\_includes/related.html -->

<h3 class="tile\_\_header"You May Also Enjoy</h3>

<div class="tiles"

{% for post in site.related\_posts limit:3 %}

<article class="tile\_\_item" itemscope itemtype="http://schema.org/CreativeWork"

<meta itemprop="text" content="{{ post.excerpt | strip\_html }}"

<a href="{{ post.url }}"

<img "{% if post.image.teaser %}{{ post.image.teaser }}{% else %}{{ site.teaser }}{% endif %}" itemprop="image" "{{ post.title }}"

<h3 class="tile\_\_title" itemprop="headline"{{ post.title | markdownify | remove: '<p>' | remove: '</p>' }}</h3>

</a>

{% if post.categories %}

{% assign category\_slug = post.categories | first %}

{% assign category = site.data.slugs\[category\_slug\] %}

<a href="/{{ post.categories | first }}/" class="tile\_\_category"{{ category.name }}</a>

{% endif %}

</article>

{% endfor %}

</div>

![](/My%20Jekyll%20Development%20process.resources/975E6700-5F9F-4C9B-9852-4DDE72819FFF.jpg)

Related posts only appear if there are three or more matches based on post.tags.

Similar in design to the related posts module, I also utilize a set of tiles for featuring posts. Visually they look the same but instead of being dynamically determined by post.tags they’re manually set and grouped by category.

##### Adding Featured Posts

The first step is to flag a post as featured. To do this, I add featured: true to its YAML Front Matter.

Next I use a variation of the [related posts include](https://github.com/mmistakes/made-mistakes-jekyll/blob/master/_includes/related.html) with additional Liquid conditionals to control headlines and other variable data.

<!-- /\_includes/featured.html -->

<h3 class="tile\_\_header"{% if page.feature.headline %}{{ page.feature.headline }}{% else %}Featured Posts{% endif %}</h3>

<div class="tiles"

{% assign features = site.categories\[page.feature.category\] | where:"featured", true %}

{% for post in features limit:3 %}

<article class="tile\_\_item" itemscope itemtype="http://schema.org/CreativeWork"

<meta itemprop="text" content="{{ post.excerpt | strip\_html }}"

<a href="{{ post.url }}"

<img "{% if post.image.teaser %}{{ post.image.teaser }}{% else %}{{ site.teaser }}{% endif %}" itemprop="image" "{{ post.title }}"

<h3 class="tile\_\_title" itemprop="headline"{{ post.title | markdownify | remove: '<p>' | remove: '</p>' }}</h3>

{% assign readtime = post.content | strip\_html | number\_of\_words | divided\_by:site.words\_per\_minute %}

<span class="tile\_\_item-time"{% if readtime = 1 %}1{% else %}{{ readtime }}{% endif %} min read</span>

</a>

{% if post.work %}

<span class="tile\_\_category"{{ post.work }}</span>

{% endif %}

</article>

{% endfor %}

</div>

To display on a page, the following YAML Front Matter is added — customizing the headline and assigning a site.categories category to pull from.

feature

visible

headline FeaturedTutorials"

category mastering-paper

Everything is pulled together by adding this to relevant layouts:

featurevisible

includefeatured

endif

![](My%20Jekyll%20Development%20process.resources/04F80293-23CA-4115-A3CF-BB612AD5BFCF.jpg)

How featured posts look when included on a page.

## Introducing Flexibility

My configuration files used to be a dumping ground for all kinds of site, navigation, and author data. This always felt messy to me and when support for data files was added I took advantage of it in my Jekyll themes first.

### Data Files

So what exactly are [data files](http://jekyllrb.com/docs/datafiles/)? I like to think of them as custom variables that Liquid can play with in all the ways you’d expect — for loops, captures, filters, you name it. Data files can be YAML, JSON, or CSV, are placed in /\_data/, and are accessible with site.data.<filename>[6](https://mademistakes.com/articles/using-jekyll-2016/#fn:data-file).

#### Easily Editable Navigation Menus

Before discovering data files I was hard-coding nav links directly into my layouts and junking up \_config.yml with them. It was with my first set of Jekyll themes that I began to see the benefit of pulling this data out into their own little world.

In an effort to build a DRY navigation menu for this site I created [/\_data/navigation.yml](https://github.com/mmistakes/made-mistakes-jekyll/blob/master/_data/navigation.yml) and added the following four links:

\# masthead navigation links

masthead

title About"

/about/

title Work"

/work/

title Blog"

/articles/

title MasteringPaper"

/mastering-paper/

As you can guess, title corresponds to the page title and url… well the URL. With these values, I can loop over the home-primary key and auto-generate list elements with the appropriate titles and links from a single file.

<!-- excerpt from /\_includes/masthead.html -->

<header class="masthead"

<div class="container"

<a class="masthead\_\_title" href="https://mademistakes.com/"Made Mistakes</a>

<nav "nav-primary" class="masthead\_\_menu-wrapper"

<ul class="masthead\_\_menu"

<li><a href="https://mademistakes.com" class="masthead\_\_menu-item"← Home</a></li>

{% for link in site.data.navigation.masthead %}

<li><a href="{{ site.url }}{{ link.url }}" class="masthead\_\_menu-item"{{ link.title }}</a></li>

{% endfor %}

<li><a href= class="overlay\_\_menu-trigger masthead\_\_menu-item" aria-label="Navigation Menu" title="Navigation Menu"• • •</a></li>

</ul>

</nav>

</div>

</header>

What’s going on here is I’m looping through site.data.navigation.masthead to pull out a title and url variable for each. If I ever need to update the masthead navigation I just edit navigation.yml and the rest is handled automatically at build.

To improve the navigation’s UI, .active classes are added using the following Liquid:

{% for link in site.data.navigation.masthead %}

<ul class="masthead\_\_menu"

{% assign class = nil %}

{% if page.url contains link.url %}

{% assign class = 'is--active' %}

{% endif %}

<li><a href="{{ site.url }}{{ link.url }}" class="masthead\_\_menu-item {{ class }}"{{ link.title }}</a></li>

</ul>

{% endfor %}

![](My%20Jekyll%20Development%20process.resources/95C9323A-72B2-4659-BFF8-28497EB5780D.jpg)

Masthead end-result after some styling.

I’ve also used a similar technique to build drop-down navigations with nested lists. An example of one of those is as follows.

##### Drop-Down Navigation Data File

\# example /\_data/navigation.yml

title About"

/about/"

children

childtitle Biography"

childhref /about/bio/"

childtitle Resume"

childhref /about/resume/"

title Portfolio"

/portfolio/"

children

childtitle Design"

childhref /portfolio/design/"

childtitle Illustration"

childhref /portfolio/illustration/"

childtitle Development"

childhref /portfolio/development/"

##### Drop-Down Navigation HTML and Liquid

<ul>

{% for nav in site.data.navigation %}

{% if nav.children != null %}

<li><a href="{{ nav.href }}"{{ nav.title }}</a>

<ul class="child"

{% for child in nav.children %}

<li><a href="{{ child.childhref }}"{{ child.childtitle }}</a></li>

{% endfor %}

</ul>

{% else %}

<li><a href="{{ nav.href }}"{{ nav.title }}</a>{% endif %}</li>

{% endfor %}

</ul>

Which will produce the following HTML:

<ul>

<li><a href="/about/"About</a>

<ul class="child"

<li><a href="/about/bio/"Biography</a></li>

<li><a href="/about/resume/"Resume</a></li>

</ul>

</li>

<li><a href="/portfolio/"Portfolio</a>

<ul class="child"

<li><a href="/portfolio/design/"Design</a></li>

<li><a href="/portfolio/illustration/"Illustration</a></li>

<li><a href="/portfolio/development/"Development</a></li>

</ul>

</li>

</ul>

#### Author Overrides

Made Mistakes has always had a singular voice, so supporting multiple authors wasn’t really on my radar. But for some of [my Jekyll themes](https://mademistakes.com/work/jekyll-themes/) the need arose and I added support for assigning authors with a data file.

To achieve this. a YAML file in created in the \_data directory with all of the authors.

\# /\_data/authors.yml

billy_rick

Billy Rick

http://emailbilly@rick.com

extravagantman."

avatar billy-rick-photo.jpg

cornelius_fiddlebone

Cornelius Fiddlebone

email cornelius@fiddlebone.com

Jewelminer."

avatar cornelius-fiddlebone-photo.jpg

Then, to override the author on any given post or page, author: is added to its YAML Front Matter with a key that matches one in authors.yml. For example to assign Billy Rick as the author of a post I’d add author: billy_rick.

With a small layout addition, Liquid is used to assign Billy Rick’s info, replacing the default values. In cases where an author isn’t set site.owner values in \_config.yml are used instead.

{% if page.author %}

{% assign author = site.data.authors\[page.author\] %}{% else %}{% assign author = site.owner %}

{% endif %}

{% if author.avatar contains 'http' %}

<img "{{ author.avatar }}" class="bio-photo" "{{ author.name }} bio photo"></a>

{% elsif author.avatar %}

<img "{{ site.url }}/images/{{ author.avatar }}" "{{ author.name }} bio photo"></a>

{% endif %}

<h3 class="author-name"{{ author.name }}</h3>

{% if author.bio %}<p class="author-bio"{{ author.bio }}</p>{% endif %}

#### Slug Names

This next one is probably overkill and inefficient in most scenarios, but for me, it has a use. The hacky way I’m going about creating breadcrumb navigations imposes some limitations on the crumb titles.

With Liquid I’m taking a page.url and then grabbing the first bit of text before /. Since I’m fairly consistent in how I organize posts (using categories as part of my permalink format) this works reliably. The problem I run into is some of these “slug” names aren’t all that descriptive or properly title cased.

By using a slugs.yml data file as a definition list I can replace these “simple slugs” with whatever I want.

Let’s use the “[What tools do you use to build your website?](https://mademistakes.com/faqs/website-tools/)” FAQ page from my site as an example. If I were to output breadcrumbs for this page, I’d filter the page.url of https://mademistakes.com/faqs/website-tools/ down to faqs and end up with the following breadcrumbs: Home > faqs

Which isn’t the worst thing in the world, but ideally faqs would be properly capitalized (eg. FAQs) or spelled out as “Frequently Asked Questions.”

To fix this, I add a faqs slug to slugs.yml and assign it a nice descriptive name to use as the title — like “Frequently Asked Questions.”

FrequentlyAskedQuestions"

The [breadcrumbs.html](https://github.com/mmistakes/made-mistakes-jekyll/blob/master/_includes/breadcrumbs.html) include is then modified to output a slug.name instead.

{% assign page\_slug = page.url | remove\_first: '/' | split: '/' %}

{% assign slug\_first = page\_slug\[0\] %}

{% assign slug = site.data.slugs\[slug\_first\] %}

<nav class="breadcrumbs"

<span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"

<a href="{{ site.url }}" class="breadcrumb\_\_item" itemprop="url"

<span itemprop="title"Home</span>

</a> <span class="breadcrumb\_\_sep"×</span>

</span>

<span itemscope itemtype="http://data-vocabulary.org/Breadcrumb"

<a href="/{{ page\_slug\[0\] }}/" class="breadcrumb\_\_item" itemprop="url"

<span itemprop="title"{{ slug.name }}</span>

</a>

</span>

</nav>

![](My%20Jekyll%20Development%20process.resources/B7C72190-1CAC-4802-8951-4EDE293A915D.jpg)

Tada! Properly capitalized and descriptive breadcrumb titles.

#### Translation Keys

Localizing my themes is an idea I’ve only started to flirt with. The thought of using [data files as translation keys](https://tuananh.org/2014/08/13/localization-with-jekyll/) for localizing text was brought to my attention through a [pull request](https://github.com/mmistakes/skinny-bones-jekyll/commit/b08024fcd4815e61eb3c9a0c60c0bc793f195db2) by [@yonojoy](https://github.com/yonojoy). This is by no means a full-on i18n solution, but it does help theme developers looking to support multiple languages.

There’s three pieces to pulling this off.

##### 1\. Languages data file

In the case of my [Skinny Bones](https://mmistakes.github.io/skinny-bones-jekyll/) starter theme, German and [French](https://github.com/mmistakes/skinny-bones-jekyll/commit/bd4c02bbf29ffbc0194fa6d871f9fefcb8979ed5) translations have been added via hashes in a YAML file (eg. /\_data/languages.yml).

locales

\# English ---------------------------------------------

&DEFAULT_EN

overview Overview"

TableContents"

written_by Written

updated Updated"

share Share

en_US

<< \*DEFAULT_EN # use en for en_US

en_UK

<< \*DEFAULT_EN # use en for en_UK

\# German translations ---------------------------------

&DEFAULT_DE

<< \*DEFAULT_EN # load English values as default

overview Übersicht"

Inhalt"

written_by Verfasst

updated Zuletztaktualisiert:"

share

de_DE

<< \*DEFAULT_DE # use de translation for de_DE

\# French translations ---------------------------------

&DEFAULT_FR

<< \*DEFAULT_EN # load English values as default

overview Aperçu"

Tablematières"

written_by Écrit

updated jour"

share Partager

fr_FR

<< \*DEFAULT_FR # use fr translation for fr_FR

##### 2\. Set locale in Jekyll config

To change the default language, a locale variable is set in \_config.yml. For example to switch from English to French you’d add locale: fr_FR or locale: fr.

##### 3\. Call in the correct language hashes

The last step is using long variables like site.data.languages.locales\[site.locale\].updated into the appropriate places — replacing any text you want to localize. If done correctly, this variable should output with the French updated string, Mis à jour.

If you want to learn more about this technique be sure to check out Tuan Anh’s [blog post](https://tuananh.org/2014/08/13/localization-with-jekyll/). Or if you’re looking for a plugin to do the heavy lifting, [Jekyll-Multiple-Languages](https://github.com/screeninteraction/jekyll-multiple-languages-plugin) might be a good place to start.

Maybe not 100% complete, but this is certainly the majority of techniques I’ve picked up using Jekyll over the years. What keeps me coming back is its flexibility — there’s no shortage of ways to approach a problem and always new things to learn. Browse the threads on [Jekyll Talk](https://talk.jekyllrb.com/) on any given day and you’ll see what I mean ![](My%20Jekyll%20Development%20process.resources/1f604.png).

1. [Kramdown](http://kramdown.gettalong.org/syntax.html) is a Markdown converter that supports features currently unavailable in plain Markdown. Things like automatically generating a table of contents from headlines, special attributes, and more. [↩](https://mademistakes.com/articles/using-jekyll-2016/#fnref:kramdown)
1. [jekyll-tagging-related_posts](https://github.com/toshimaru/jekyll-tagging-related_posts) - replaces Jekyll’s related_posts function to use tags to calculate better post relationships. [↩](https://mademistakes.com/articles/using-jekyll-2016/#fnref:related-posts)
1. The profiler can be enabled with the --profile flag (eg. jekyll build --profile). [↩](https://mademistakes.com/articles/using-jekyll-2016/#fnref:profiler)
1. Less is a CSS pre-processor, meaning that it extends the CSS language, adding features that allow variables, mixins, functions to make it more maintainable. [↩](https://mademistakes.com/articles/using-jekyll-2016/#fnref:less)
1. Output the source of an asset using asset_source Jekyll-Assets tag. Example: asset_sourcecritical.css [↩](https://mademistakes.com/articles/using-jekyll-2016/#fnref:assets-tag-example)
1. Example: Data file /\_data/foo.yml is accessible via site.data.foo. [↩](https://mademistakes.com/articles/using-jekyll-2016/#fnref:data-file)
