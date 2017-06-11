const gulp = require('gulp');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const rename = require("gulp-rename");
const del = require('del');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('clean_js', () => del(['build/js/*.js']));
gulp.task('clean_css', () => del(['build/css/*.css']));
gulp.task('clean', ['clean_css', 'clean_js'], () => {});

const jsAssets = {
    'foodmap': 'modules/foodmap/frontend/index.js',
    'flavortown': 'modules/foodmap/frontend/flavortown.js',
}

gulp.task('scripts', ['clean_js'], () => {
    Promise.all(Object.keys(jsAssets).map((assetName) => {
        return new Promise((resolve, reject) => {
            browserify(jsAssets[assetName])
                .transform('babelify')
                .bundle()
                .pipe(source(jsAssets[assetName]))
                .pipe(rename(`${assetName}.js`))
                .pipe(gulp.dest('build/js'))
                .on('end', resolve)
        })
    }))
});

gulp.task('styles', ['clean_css'], () => {
    gulp.src([
            'core/frontend/stylus/global.styl', 
            'modules/*/frontend/*.styl'
        ])
        .pipe(stylus())
        .pipe(rename((path) => {
            let newName;
            if (path.dirname === '.') {
                newName = 'globals';
            }
            else {
                newName = path.dirname.split('/')[0];  
            } 
            path.dirname = '';
            path.basename = newName;
        }))
        .pipe(gulp.dest('build/css'))
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'styles']);