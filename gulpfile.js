const gulp = require('gulp');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babelify = require('babelify'); // eslint-disable-line
// const sourcemaps = require('gulp-sourcemaps');
// const buffer = require('vinyl-buffer');

gulp.task('clean_js', () => del(['build/js/*.js']));
gulp.task('clean_css', () => del(['build/css/*.css']));
gulp.task('clean', ['clean_css', 'clean_js'], () => {});

const jsAssets = {
  foodmap: 'modules/foodmap/frontend/index.js',
  flavortown: 'modules/foodmap/frontend/flavortown.js',
  random_pocket: 'modules/random_pocket/frontend/index.js',
  twitter_recap: 'modules/twitter_recap/frontend/index.js',
};

gulp.task('scripts', ['clean_js'], () => {
  Promise.all(Object.keys(jsAssets).map(assetName => new Promise((resolve) => {
    browserify(jsAssets[assetName])
                .transform('babelify', { presets: ['env'], sourceMaps: true })
                .bundle()
                .pipe(source(jsAssets[assetName]))
                // .pipe(buffer())
                .pipe(rename(`${assetName}.js`))
                // .pipe(sourcemaps.init({loadMaps: true}))
                // .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('build/js'))
                .on('end', resolve);
  })));
});

gulp.task('styles', ['clean_css'], () => {
  gulp.src([
    'core/frontend/stylus/*.styl',
    'modules/*/frontend/*.styl',
  ])
        .pipe(stylus())
        .pipe(rename((path) => {
          let newName;
          if (path.dirname === '.') {
            newName = path.basename;
          } else {
            newName = path.dirname.split('/')[0];
          }
          path.dirname = '';
          path.basename = newName;
        }))
        .pipe(gulp.dest('build/css'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'styles']);
