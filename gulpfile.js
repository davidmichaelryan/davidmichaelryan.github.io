const gulp = require('gulp');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const del = require('del');

gulp.task('clean_js', () => del(['build/js/*.js']));

gulp.task('clean_css', () => del(['build/css/*.css']));

gulp.task('clean', ['clean_css', 'clean_js'], () => {});

gulp.task('scripts', ['clean_js'], () => {
  gulp.src('public/scripts/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('styles', ['clean_css'], () => gulp.src('public/stylus/*.styl')
        .pipe(stylus())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('build/css')));

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'styles']);
