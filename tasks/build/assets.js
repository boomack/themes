/*******************************
 Build Task
 *******************************/

var
  gulp      = require('gulp'),

  // gulp dependencies
  chmod     = require('gulp-chmod'),
  gulpif    = require('gulp-if'),
  normalize = require('normalize-path'),
  print     = require('gulp-print').default,

  // config
  config    = require('../config/user'),
  tasks     = require('../config/tasks'),
  install   = require('../config/project/install'),

  log       = tasks.log
;

function defaultSource(config) {
  return [
    normalize(config.paths.source.themes + '/**/assets/**/*.*'),
    normalize(config.paths.source.site + '/assets/**/*.*'),
  ];
}

function build(src, config) {
  return gulp.src(src, {base: config.paths.source.themes})
    .pipe(gulpif(config.hasPermissions, chmod(config.parsedPermissions)))
    .pipe(gulp.dest(config.paths.output.themes))
    .pipe(print(log.created))
    ;
}

function buildAssets(src, config, callback) {
  if (!install.isSetup()) {
    console.error('Cannot build assets. Run "gulp install" to set-up Semantic');
    callback();
    return;
  }

  if (callback === undefined) {
    callback = config;
    config   = src;
    src      = defaultSource(config);
  }

  // copy assets
  var assets         = () => build(src, config);
  assets.displayName = "Building Assets";

  gulp.series(assets)(callback);
}

module.exports = function (callback) {
  buildAssets(config, callback);
};

module.exports.watch = function (type, config) {
  gulp
    .watch(defaultSource(config))
    .on('all', function (event, path) {
      console.log('Change in assets detected');
      return gulp.series((callback) => buildAssets(path, config, callback))();
    });
};

module.exports.buildAssets = buildAssets;