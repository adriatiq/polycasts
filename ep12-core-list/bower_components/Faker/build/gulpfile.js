/**
 * Copyright 2017 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*

  gulpfile.js - gulp script for building Faker package for browser / stand-alone package
  run this file using the gulp command
  
  If this is your first time trying to build faker, you will need to install gulp:

    cd faker.js/
    [sudo] npm install
    [sudo] npm install gulp -g
    cd build/
    gulp

*/

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mustache = require('gulp-mustache');
var browserify = require('browserify');
var transform = require('vinyl-transform');


gulp.task('browser-package', function() {

  /* task for building browser bundles using browserify

     this task will generate the following files:

      ./build/faker.js
      ./build/faker.min.js
      ../examples/browser/js/faker.js
      ../examples/browser/js/faker.min.js

  */

  var browserified = transform(function(filename) { 
    // use browserify to create UMD stand-alone browser package
    var b = browserify(filename, {
      standalone: 'faker'
    });
    return b.bundle();
  });

  return gulp.src('../index.js')
    .pipe(browserified)
    .pipe(rename('faker.js'))
    .pipe(gulp.dest('build/'))
    .pipe(gulp.dest('../examples/browser/js'))
    .pipe(rename({ extname: ".min.js" }))
    .pipe(uglify())
    .pipe(gulp.dest('build/'))
    .pipe(gulp.dest('../examples/browser/js'))
    .pipe(rename('../examples/browser/js/faker.min.js'));

});


// builds Readme.md file from docs.md and exported faker methods
gulp.task('documentation', function(cb) {

  /* task for generating documentation

     this task will generate the following file:

      ../Readme.md

  */

  var API = '';
  var faker = require('../index');

  // generate nice tree of api for docs
  API += '<ul>';
  for (var module in faker) {
    API += '<li>' + module;
    API += '<ul>';
    for (var method in faker[module]) {
      API += '<li>' + method + '</li>';
    }
    API += '</ul>';
    API += '</li>';
  }
  API += '</ul>';

  return gulp.src('./src/docs.md')
    .pipe(mustache({
       'API': API,
       'copyrightYear': new Date().getFullYear()
     }))
    .pipe(rename("./Readme.md"))
    .pipe(gulp.dest('../'))

});

gulp.task('default', ['browser-package', 'documentation']);