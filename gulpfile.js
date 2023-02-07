/*******************************
 *           Set-up
 *******************************/

var
  gulp   = require('gulp'),
  transformer = require('gulp-text-simple'),
  del = require('del'),

  // read user config to know what task to load
  config = require('./tasks/config/user')
;


/*******************************
 *            Tasks
 *******************************/

require('./tasks/collections/build')(gulp);
require('./tasks/collections/various')(gulp);
require('./tasks/collections/install')(gulp);

gulp.task('default', gulp.series('watch'));

/*--------------
      Docs
---------------*/

require('./tasks/collections/docs')(gulp);

/*--------------
      RTL
---------------*/

if (config.rtl) {
  require('./tasks/collections/rtl')(gulp);
}

gulp.task('copy-site-fonts', () =>
  gulp.src([
    'src/site/assets/fonts/*.woff',
    'src/site/assets/fonts/*.woff2',
  ])
  .pipe(gulp.dest('dist/site/assets/fonts/')))
gulp.task('copy-site-fonts').description = 'Copy site font files from source to output';

gulp.task('copy-theme-assets', () =>
  gulp.src('src/theme/default/assets/**')
    .pipe(gulp.dest('dist/theme/default/assets/')))
gulp.task('copy-theme-assets').description = 'Copy theme assets from source to output';

gulp.task('fix-font-paths', () =>
  gulp.src('dist/semantic*.css')
    .pipe(transformer(function (text) {
      text = text.replace(
        /url\((?<quote>["']?)(?:\.\/)?themes\/default\/assets\/fonts\//g,
        'url($<quote>../../fonts/');
      text = text.replace(
        /url\((?<quote>["']?)(?:\.\/)?site\/assets\/fonts\//g,
        'url($<quote>fonts/');
      return text;
    })())
    .pipe(gulp.dest('dist/')));
gulp.task('fix-font-paths').description = 'Fix the relative path of icon fonts in the CSS output';

gulp.task('publish', gulp.series('copy-site-fonts', 'copy-theme-assets', 'fix-font-paths'))
