# Node Static Site Template
This is a basic template package for quickly building small static sites on Node. It uses express for the server, and renders jade for html files and sass/scss for css files by default. I use a very similar setup for my personal site and logophile game, so I decided to just create a blank verison with some bare essentials already set up.

### Main Features - How it Works
* Anything in the public directory is served statically
* Any index.html files are redirected to their directory root
* Any non-filename paths are redirected to the trailing slash version (if they weren't originally)
* Any path under public will automatically render its respective .jade file. For example, if the file structure "/public/test/index.jade" exists, then going to "http://example.com/test/" will render that jade file.
* Any .sass or .scss files are rendered to css before being sent to the client by requests to the same path except ending in .css.
* Rendering jade and sass files at the time the http response is sent does slightly impact performance, but it's very minimal in my experience and it beats having to manually compile them every time you make a change. Definitely keeps the project organized and minimal feeling.

### Other Features
(Optional) The included build-client.sh script in /public/assets/js will run browserify + minify on the specified file (in our case, we'd want to use main.js). Those must be installed before using it. It will output a filename.build.js, and filename.build.min.js, so if it's used then the default main script in /public/parts/footer-assets.jade should be changed to one of the output files.

The build-client script can easily be made into a sublime build system by creating a new build system in sublime and setting the shell command to "sh build-client.sh $file". I've found this to be very nice, because I can just open the main javascript file and press ctrl+b to build the packed/minified version.

### Releases
1.0.0: First release

