/**
 * 
 * Build the template optimized for live preview
 * Minify source files
 * Optimize images
 * Output folder ./live
 *
 * @package ZiON
 */



var gulp	        = require('gulp'),
	plumber         = require('gulp-plumber'),
    
    //sass plugins
    autoprefixer    = require('gulp-autoprefixer'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    rtlcss          = require('gulp-rtlcss'),
    sourcemaps      = require('gulp-sourcemaps'),
    
    //pug plugins
    pug				= require ('pug'),
    gulpJade		= require('gulp-jade');
    
    mainBowerFiles	= require('main-bower-files'),
    preprocess		= require('gulp-preprocess'),
    
    //optimize images
    imagemin = require('gulp-imagemin'),

    //uglify javascript
    uglifyjs = require('gulp-uglify');




/**
 * 
 * Main task for Building the live version
 *
*/

gulp.task('live', ['live:sass', 'live:pug', 'live:assets']);





/** 
 * Compile & minify SCSS files with burbon & autoprefixer
*/

gulp.task('live:sass', function () {
	
	return gulp.src('./assets/scss/**/*.scss')
        .pipe(plumber())
	    .pipe(sass({
            outputStyle : 'compressed',
            includePaths: require('node-bourbon').includePaths
        }).on('error', sass.logError))
	    .pipe(autoprefixer({
	        browsers: ['last 5 versions'],
	        cascade: false
	    }))
        .pipe(plumber.stop())
	    .pipe(gulp.dest('./live/assets/css'))
		.pipe(rtlcss()) // Convert to RTL. 
	    .pipe(rename({ suffix: '-rtl' })) // Append "-rtl" to the filename. 
	    .pipe(gulp.dest('./live/assets/css'));
});





/** 
 * Compile .pug files and generate minified HTML
*/

gulp.task('live:pug', function () {

	return gulp.src('./pages/*.pug')
	    .pipe(plumber())
	    .pipe(gulpJade({
	      jade: pug,
	      pretty: false,
	      locals:{ZION_ENV:'LIVE'}
	    }))
		.pipe(plumber.stop())
	    .pipe(gulp.dest('./live'));
});





/** 
 * Handle assets & Optimize images
*/


gulp.task('live:assets', ['live:images', 'live:videos', 'live:fonts', 'live:js', 'live:php', 'live:lib', 'live:bower']);





/* Push images */
gulp.task('live:images', function () {
    return gulp.src('./assets/images/**/{*.jpg,*.png,*.gif,*.ico}')
	    .pipe(imagemin({
                progressive: true
        	}))
        .pipe(gulp.dest('live/assets/images'));
});


/* Push videos */
gulp.task('live:videos', function () {
    return gulp.src('./assets/videos/**/*')
        .pipe(gulp.dest('live/assets/videos'));
});


/* Push fonts */
gulp.task('live:fonts', function () {
    return gulp.src('./assets/fonts/**/*')
        .pipe(gulp.dest('live/assets/fonts/'));
});


/* Push js files */
gulp.task('live:js', function () {
    return gulp.src(['./assets/js/*.js'])
        .pipe(preprocess({context: { ZION_ENV : 'LIVE'}}))
        .pipe(uglifyjs())
        .pipe(gulp.dest('live/assets/js/'));
});


/* Push php files */
gulp.task('live:php', function () {
 	return gulp.src(['./zcore/php/**/*.php', './php/**/*.php'])
        .pipe(gulp.dest('live/php/'));
});


/* Merge & push bower main files */
gulp.task('live:bower', function() {
    return gulp.src(mainBowerFiles(), { base: './bower_components' })
        .pipe(gulp.dest('live/assets/lib'));
});


/* Push custom library files */
gulp.task('live:lib', function () {
    return gulp.src('./assets/lib/**/*.*')
        .pipe(gulp.dest('live/assets/lib'));
});