var gulp = require('gulp');
var stylus = require('gulp-stylus');

gulp.task('css', function() {
    return gulp.src('styl/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('styl/'));
});

gulp.task('default', ['css']);
