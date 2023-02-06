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

gulp.task('fix-font-paths', () =>
  gulp.src('dist/semantic*.css')
    .pipe(transformer(function (text) {
      text = text.replace(
        /url\((?<quote>["']?)(?:\.\/)?themes\/default\/assets\/fonts\//g,
        'url($<quote>../../fonts/');
      return text;
    })())
    .pipe(gulp.dest('dist/')));
gulp.task('fix-font-paths').description = 'Fix the relative path of icon fonts in the CSS output';
