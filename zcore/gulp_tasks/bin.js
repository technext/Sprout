/**
 * 
 * Build the template in ./bin with all the assets
 * Serve the template at http://localhost:3000
 * Watch the files and automate refresh
 * 
 *
 * @package ZiON
 */


var gulp        	= require('gulp'),

	//serve the template
	browserSync 	= require('browser-sync').create(),
	reload      	= browserSync.reload,
	
	//prevents work flow from breaking on compilation error
	plumber         = require('gulp-plumber'),
	
    //sass plugins
    autoprefixer    = require('gulp-autoprefixer'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    rtlcss          = require('gulp-rtlcss'),
    sourcemaps      = require('gulp-sourcemaps'),
    
    //pug plugins
    pug            	= require ('pug'),
    gulpJade       	= require('gulp-jade'),
    
    
    //For handling assets
    mainBowerFiles 	= require('main-bower-files'),
    preprocess 		= require('gulp-preprocess'),
    watch           = require('gulp-watch'),
    
    //native node plugins
    fs 				= require('fs');



/**
 * 
 * Main task for Build, serve & watch the template
 *
*/
gulp.task('bin', ['build', 'serve', 'watch']);






/** =======================================================

 Build from the compilables

======================================================= **/


gulp.task('build', ['build:scss', 'build:assets']);



/** 
 * Compile SCSS files with burbon & autoprefixer
*/
gulp.task('build:scss', function(){
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
        .pipe(plumber.stop())
	    .pipe(gulp.dest('./bin/assets/css'))
	    .pipe(browserSync.stream())
		.pipe(rtlcss()) // Convert to RTL. 
	    .pipe(rename({ suffix: '-rtl' })) // Append "-rtl" to the filename. 
	    .pipe(gulp.dest('./bin/assets/css'))
		.pipe(browserSync.stream());
});







/** =======================================================

 Handle assets

======================================================= **/


gulp.task('build:assets', ['asset:images', 'asset:videos', 'asset:fonts', 'asset:js', 'asset:php', 'asset:lib', 'asset:bower']);



/* Push images */
gulp.task('asset:images', function () {
    return gulp.src('./assets/images/**/{*.jpg,*.png,*.gif,*.ico}')
        .pipe(watch('./assets/images/**/{*.jpg,*.png,*.gif,*.ico}'))
        .pipe(gulp.dest('bin/assets/images'));
});


/* Push videos */
gulp.task('asset:videos', function () {
    return gulp.src('./assets/videos/**/*')
        .pipe(watch('./assets/videos/**/*'))
        .pipe(gulp.dest('bin/assets/videos'));
});


/* Push fonts */
gulp.task('asset:fonts', function () {
    return gulp.src('./assets/fonts/**/*')
        .pipe(watch('./assets/fonts/**/*'))
        .pipe(gulp.dest('bin/assets/fonts/'));
});


/* Push js files */
gulp.task('asset:js', function () {
    return gulp.src(['./assets/js/*.js'])
        .pipe(watch(['./assets/js/*.js']))
        .pipe(preprocess({context: { ZION_ENV : 'DEBUG'}}))
        .pipe(gulp.dest('bin/assets/js/'));
});


/* Push php files */
gulp.task('asset:php', function () {
 	return gulp.src(['./zcore/php/**/*.php', './php/**/*.php'])
 		.pipe(watch(['./php/**/*.php']))
        .pipe(gulp.dest('bin/php/'));
});


/* Merge & push bower main files */
gulp.task('asset:bower', function() {
    return gulp.src(mainBowerFiles(), { base: './bower_components' })
        .pipe(gulp.dest('bin/assets/lib'));
});


/* Push custom library files */
gulp.task('asset:lib', function () {
    return gulp.src('./assets/lib/**/*.*')
    	.pipe(watch(['./assets/lib/**/*.*']))
        .pipe(gulp.dest('bin/assets/lib'));
});







/** =======================================================

 Serve the template

======================================================= **/

/** 
 * Browsersync middleware function
 * Compiles .pug files with browsersync
*/
function compilePug (req, res, next) {
    
    var parsed = require("url").parse(req.url);
    
    if (parsed.pathname.match(/\.html$/) || parsed.pathname == '/') {
        
        var file = 'index';
        
        if(parsed.pathname != '/'){
            file = parsed.pathname.substring(1, (parsed.pathname.length - 5));
        }

        var html = pug.renderFile(__dirname+'/../../pages/'+file+'.pug', {ZION_ENV:'DEBUG', pretty:true});
        fs.writeFileSync('./bin/'+file+'.html', html);
    }

    next();
}





/** 
 *
 * Serve the template at http://localhost:3000
 * Compiles .pug files on the fly
 *
*/

gulp.task('serve', function(){

    browserSync.init({
        server: {
            baseDir: "bin/"
        },
        middleware: compilePug
    });

});






/** =======================================================

 The night's watch!

======================================================= **/

gulp.task('watch', function(){
	
	gulp.watch(['./pages/*.pug', './pug_modules/**/*.pug'], reload);
	gulp.watch(['./bin/assets/**/*.*', '!./bin/assets/css/**/*.*'], reload); 
	gulp.watch(['./assets/scss/**/*.scss'], ['build:scss']);
	
});