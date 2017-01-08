var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');

gulp.task('styles', function() {
  gulp.src('*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('jade', function() {
  gulp.src('*.jade')
    .pipe(jade()) // pip to jade plugin
    .pipe(gulp.dest('./dist/')); // tell gulp our output folder
});

gulp.task('scripts', function() {
  gulp.src('*.js', {base: './'})
  .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function() {
  gulp.watch('*.scss',['styles']);
  gulp.watch('*.jade',['jade']);
  gulp.watch('*.js',['scripts']);
});
