var gulp = require('gulp'),
    del = require('del');
    
    
gulp.task('clean', function(){
    del(['./bin/', './compressed/', './product/HTML/'], {force:true});
    return;
});