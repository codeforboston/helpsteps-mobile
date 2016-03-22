var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('karma').server;
var preprocess = require('gulp-preprocess');
var replace = require('gulp-replace-task');  
var args    = require('yargs').argv;  
var fs      = require('fs');

gulp.task('development', ['load-development-fonts', 'load-development-google-analytics'])

gulp.task('production', ['load-production-fonts','load-production-google-analytics'])

//alter google analytics tracking code. Can be dev or prod
gulp.task('load-development-google-analytics', function () {  
  
  var settings = JSON.parse(fs.readFileSync('./config/' + 'dev.json', 'utf8'));

//Replace each placeholder with the correct value for the variable.  
gulp.src('./config/appSettings.js')  
  .pipe(replace({
    patterns: [
      {
        match: 'googleAnalyticsCode',
        replacement: settings.googleAnalyticsCode
      },
      {
        match: 'foodIcon',
        replacement: 'ion-ios-nutrition'
      },
      //education
      {
        match: 'educationIcon',
        replacement: 'ion-paper-airplane'
      },
      //addiction and recovery
      {
        match: 'addictionAndRecoveryIcon',
        replacement: 'ion-android-bar'
      }
    ]
  }))
  .pipe(gulp.dest('./www/js'));

});

gulp.task('load-production-google-analytics', function () {  
  
  var settings = JSON.parse(fs.readFileSync('./config/' + 'prod.json', 'utf8'));

//Replace each placeholder with the correct value for the variable.  
gulp.src('./config/appSettings.js')  
  .pipe(replace({
    patterns: [
      {
        match: 'googleAnalyticsCode',
        replacement: settings.googleAnalyticsCode
      },
      //food
      {
        match: 'foodIcon',
        replacement: 'ion-apple'
      },
      //education
      {
        match: 'educationIcon',
        replacement: 'ion-hat-icon'
      },
      //addiction and recovery
      {
        match: 'addictionAndRecoveryIcon',
        replacement: 'ion-road-perspective'
      }
    ]
  }))
  .pipe(gulp.dest('./www/js'));

});

gulp.task('set-google-analytics', function () {  
  // Get the environment from the command line
  var env = args.env || 'dev';

  // // Read the settings from the right file
  var filename = env + '.json';
  var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));

//Replace each placeholder with the correct value for the variable.  
gulp.src('./config/appSettings.js')  
  .pipe(replace({
    patterns: [
      {
        match: 'googleAnalyticsCode',
        replacement: settings.googleAnalyticsCode
      }
    ]
  }))
  .pipe(gulp.dest('./www/js'));

});

/**
* Test task, run test once and exit
*/
gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/tests/my.conf.js',
        singleRun: true
    }, function() {
        done();
    });
});

var paths = {
  sass: ['./scss/**/*.scss']
};

//set fonts and google analytics to dev by default
gulp.task('default', ['sass', 'development']);
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('load-production-fonts', function () {  
  
gulp.src('./config/private-fonts/*').pipe(gulp.dest('./www/lib/ionic/fonts'));
//replace icons on home page


  
});

gulp.task('load-development-fonts', function () {  
  
gulp.src('./config/public-fonts/*').pipe(gulp.dest('./www/lib/ionic/fonts'));

//replace icons on home page

  // gulp.src('./www/js/settingsBuild/appSettings.js')  
  // .pipe(replace({
  //   patterns: [      
  //     //food
  //     {
  //       match: 'foodIcon',
  //       replacement: 'ion-ios-nutrition'
  //     },
  //     //education
  //     {
  //       match: 'educationIcon',
  //       replacement: 'ion-paper-airplane'
  //     },
  //     //addiction and recovery
  //     {
  //       match: 'addictionAndRecoveryIcon',
  //       replacement: 'ion-android-bar'
  //     }
  //   ]
  // }))
  // .pipe(gulp.dest('./www/js'));
  
});


