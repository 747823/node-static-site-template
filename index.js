"use strict";

var Express = require( "express" );
var Jade = require( "jade" );
var Sass = require( "node-sass" );
var RenderSass = require( "express-render-sass" );
var Package = require( "./package.json" );
var Fs = require( "fs" );

// For production sites, it might be best to proxy this from port 80 via another server like apache
var HTTP_PORT = ( process.env.PORT ) ? process.env.PORT : 3000;

// Base public directory
var BASE_DIR = __dirname + "/public";


( function() {

  // Start express server
  var app = Express();
  var expressServer = app.listen( HTTP_PORT, function() {
    var host = expressServer.address().address;
    var port = expressServer.address().port;
    console.log( "Server listening at http://" + host + port );
  } );


  // SASS renderer
  app.use( RenderSass( BASE_DIR ) );


  // Redirect anything ending in no slash or index.html to the directory root with trailing slash
  app.use( function( req, res, next ) {

    // Split the parameters from the actual path
    var parts = req.url.split( "?" );
    var path = parts[ 0 ];
    var params = "";
    if ( parts.length > 1 ) {
      params = "?" + parts[ 1 ];
    }

    // Redirect any ending index.html
    if ( path.match( /index\.html$/ ) ) {
      res.redirect( 302, path.replace( "index.html", "" ) + params );
      return;
    }

    // Redirect to trailing slash (besides site root)
    var lastPart = path.split( "/" ).slice( -1 )[ 0 ];
    if ( lastPart && lastPart.indexOf( "." ) < 0 && lastPart.slice( -1 ) !== "/" ) {
      res.redirect( 302, path + "/" + params );
      return;
    }

    next();

  } );


  // Route to index.jade for the respective path
  app.use( function( req, res, next ) {
    // If the url ends in a slash, try to render a jade file here
    if ( req.url.match( /\/$/ ) ) {
      var jadeFilePath = BASE_DIR + req.url + "index.jade";
      // console.log( "Attempting to access " + jadeFilePath );
      try {
        // This will throw an error to catch if the jade file doesn't exist
        Fs.accessSync( jadeFilePath );
        // If it didn't error, send the rendered file
        res.status( 200 ).send( Jade.renderFile( jadeFilePath, {
          pretty: "  "
        } ) );
        return;
      }
      catch ( err ) {
        // In this case it will probably end up 404'ing
        console.log( err );
      }
    }
    next();
  } );


  // Serve static files from public directory
  app.use( Express.static( BASE_DIR, {
    index: false,
    maxAge: 1,
    setHeaders: function( res, path, stat ) {
      // res.set("Content-Type", "text/html");
    }
  } ) );


  // Handle anything else as 404
  app.use( function( req, res, next ) {
    res.status( 404 ).send( Jade.renderFile( BASE_DIR + "/404.jade", {
      pretty: "  "
    } ) );
  } );


} )();