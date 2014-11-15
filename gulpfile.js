var gulp   = require('gulp');
var concat = require('gulp-concat');
var karma  = require('gulp-karma');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

function karmaFiles(useDist) {
  var files = useDist
      ? ['dist/directive.js']
      : ['src/common.js', 'src/directive-container.js'];
    
  var tests = ['test/directiveSpec.js'];

  return files.concat(tests);
}

function sourceFiles() {
  return [
    'src/public.js',
    'src/common.js',
    'src/directive-container.js',
    'src/public-bottom.js'
  ];
}

function karmaConfig(action) {
  return {
    configFile: 'karma.conf.js',
    action: action || 'run'
  };
}

gulp.task('build', function() {
  return gulp.src(sourceFiles())
    .pipe(concat('directive.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function() {
  return gulp.src('dist/directive.js')
    .pipe(uglify())
    .pipe(rename('dist/directive.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('package', ['build', 'minify']);

gulp.task('test', function() {
  return gulp.src(karmaFiles()).pipe(karma(karmaConfig()));
});

gulp.task('test:dist', ['package'], function() {
  return gulp.src(karmaFiles(true)).pipe(karma(karmaConfig()));
});

gulp.task('autotest', function() {
  return gulp.src(karmaFiles()).pipe(karma(karmaConfig('watch')));
});
