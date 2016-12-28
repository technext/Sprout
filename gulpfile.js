/**
 * The base Task runner for ZiON
 *
 * The gulpfile.js connects all other sub task runners.
 * All the task runners are located at './zcore/gulp_tasks'
 * 
 *
 * ZiON currently supports the following major commands:
 *
 * * gulp
 * * gulp:bin (alies `gulp`)
 * * gulp:product
 * * gulp:compress
 *
 * @link https://zioplates.com/
 *
 * @package ZiON
 */


var gulp        = require('gulp'),
	requireDir  = require('require-dir');


requireDir('./zcore/gulp_tasks');

gulp.task('default', ['bin'],  function() {
	console.log("\n\n*** Firing up!! ***\n\n");
});