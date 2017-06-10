const gulp = require('gulp');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const rename = require("gulp-rename");
const del = require('del');
const assetConfig = require('./assetConfig.json');

gulp.task('clean_js', () => del(['build/js/*.js']));

gulp.task('clean_css', () => del(['build/css/*.css']));

gulp.task('clean', ['clean_css', 'clean_js'], () => {});

gulp.task('scripts', ['clean_js'], () => {

    let { js } = assetConfig;

    Object.keys(js).map((moduleName) => {
        Object.keys(js[moduleName]).map((assetName) => {
                gulp.src(js[moduleName][assetName].map((fileName) => {
                    return `${__dirname}/../modules/${moduleName}/frontend/${fileName}.js`;
                }))
                    .pipe(concat(`${assetName}.js`))
                    .pipe(gulp.dest('build/js'))
            })
    })
});

gulp.task('styles', ['clean_css'], () => {
    let globalPromise = new Promise((resolve, reject) => {
        gulp.src('core/frontend/stylus/global.styl')
            .pipe(stylus())
            .pipe(concat('globals.css'))
            .pipe(gulp.dest('build/css'))
            .on("end", resolve);
    });

    let modulesPromise = new Promise((resolve, reject) => {
        let { css } = assetConfig;
        Promise.resolve(Object.keys(css).map((moduleName) => {
            Promise.all(Object.keys(css[moduleName]).map((assetName) => {
                    gulp.src(css[moduleName][assetName].map((fileName) => {
                        return `${__dirname}/../modules/${moduleName}/frontend/${fileName}.styl`;
                    }))
                        .pipe(stylus())
                        .pipe(concat(`${assetName}.css`))
                        .pipe(gulp.dest('build/css'))
                }))
        }))
        .then(resolve())
    });

    Promise.all([globalPromise, modulesPromise]);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'styles']);
