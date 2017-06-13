var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');

gulp.task('styles', function() {
  gulp.src('*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./test'));
});

gulp.task('pug', function() {
  gulp.src('*.pug')
    .pipe(pug()) // pip to pug plugin
    .pipe(gulp.dest('./test/')); // tell gulp our output folder
});

gulp.task('scripts', function() {
  gulp.src('*.js', {base: './'})
  .pipe(gulp.dest('./test/'));
});

gulp.task('default', function() {
  gulp.watch('*.scss',['styles']);
  gulp.watch('*.pug',['pug']);
  gulp.watch('*.js',['scripts']);
});
