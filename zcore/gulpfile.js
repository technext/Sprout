// *************************************
//
// JUST DOING AVG WILL KILL YOU!
// 
//  Gulp tasks for zion core
//  @since v0.5
//
// *************************************
//
// Available tasks:
//
//   `gulp`
//
//
// *************************************


var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var fs = require('fs');

//****
//****
//**** Workflow controller for ZiON Core development
//****
//****


//var timerequire = require("time-require");
var plumber         = require('gulp-plumber'),
    watch           = require('gulp-watch'),
    
    //sass plugins
    autoprefixer    = require('gulp-autoprefixer'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    rtlcss          = require('gulp-rtlcss'),
    sourcemaps      = require('gulp-sourcemaps'),
    
    //pug plugins
    pug            = require ('pug'),
    gulpJade       = require('gulp-jade'),

    mainBowerFiles = require('main-bower-files');




// Compiling scss and pug
gulp.task('compile', ['compile:scss']);


//not using for now :)
gulp.task('compile:pug', function () {
  return gulp.src('./pages/*.pug')
    .pipe(plumber())
    .pipe(gulpJade({
      jade: pug,
      pretty: true
    }))
    .pipe(gulp.dest('./bin'))
    .pipe(plumber.stop());
});


gulp.task('compile:scss', function () {

  	return gulp.src('./assets/scss/**/*.scss')
      .pipe(plumber())
	    .pipe(sourcemaps.init())
	    .pipe(sass({
        outputStyle : 'expanded',
        includePaths: require('node-bourbon').includePaths
      }).on('error', sass.logError))
	    .pipe(autoprefixer({
	        browsers: ['last 5 versions'],
	        cascade: false
	    }))
      .pipe(sourcemaps.write())
	    .pipe(gulp.dest('./bin/assets/css'))
	    .pipe(plumber.stop())
      .pipe(browserSync.stream());

    // //rtl stylesheet (Todo)
});


// Pushing alll the assets
gulp.task('assets', ['asset:bower', 'asset:php'], function () {
  return gulp.src('./assets/**/*.*')
    .pipe(gulp.dest('./bin/assets/'));
});


gulp.task('asset:php', function () {
 	return gulp.src('./php/**/*.php')
        .pipe(gulp.dest('./bin/php/'));
});


    
gulp.task('asset:bower', function() {
    return gulp.src(mainBowerFiles(), { base: './bower_components' })
        .pipe(gulp.dest('./bin/assets/lib'));
});



gulp.task('watch', function () {
  
  gulp.watch('./assets/scss/**/*.scss', ['compile:scss']);
  gulp.watch('./assets/**/*.*', ['assets']);

  gulp.watch(['./pages/*.pug', './pug_modules/**/*.pug'], reload); 

});




// todo:: refactor with gulp_tasks/server.js

function pugMiddleWare (req, res, next) {
    
    var parsed = require("url").parse(req.url);
    
    if (parsed.pathname.match(/\.html$/) || parsed.pathname == '/') {
        
        var file = 'index';
        
        if(parsed.pathname != '/'){
            file = parsed.pathname.substring(1, (parsed.pathname.length - 5));
        }

        var html = pug.renderFile(__dirname+'/pages/'+file+'.pug', {pretty:true});
        fs.writeFileSync('./bin/'+file+'.html', html);
    }

    next();
}



gulp.task('serve', function() {

	//Static server using browser sync
    browserSync.init({
        server: {
            baseDir: "bin/"
        },
        middleware: pugMiddleWare
    });

    //gulp.watch('./bin/*.html').on('change', reload);
});


gulp.task('default', ['compile', 'assets', 'watch', 'serve'],  function() {
	console.log("\n\n*** ZCore is firing up ***\n\n");
});