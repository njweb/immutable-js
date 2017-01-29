'use strict';
let gulp = require('gulp');
let minify = require('uglify-js').minify;
let rollup = require('rollup-stream');
let uglify = require('rollup-plugin-uglify');
let babel = require('rollup-plugin-babel');
let replace = require('rollup-plugin-replace');
let babelRegister = require('babel-register');
let source = require('vinyl-source-stream');

let jest = require('jest-cli');

let pkg = require('./package.json');

let libEntry = './src/Immutable.js'
let libDestFolder = './dist';

gulp.task('build_lib', function () {
  return rollup({
    entry: libEntry,
    format: 'umd',
    exports: 'named',
    moduleName: pkg.name,
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        exclude: 'node_modules/**',
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      })
    ]
  }).pipe(source(pkg.name + '.js'))
    .pipe(gulp.dest(libDestFolder));
});

gulp.task('build_esm_lib', function() {
  return rollup({
    entry: libEntry,
    format: 'es',
    exports: 'named',
    moduleName: pkg.name,
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        exclude: 'node_modules/**',
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      })
    ]
  }).pipe(source(pkg.name + '.esm.js'))
    .pipe(gulp.dest(libDestFolder));
})

gulp.task('build_min_lib', function () {
  return rollup({
    entry: libEntry,
    format: 'umd',
    exports: 'named',
    moduleName: pkg.name,
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        exclude: 'node_modules/**',
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      }),
      uglify({}, minify)
    ]
  }).pipe(source(pkg.name + '.min.js'))
    .pipe(gulp.dest(libDestFolder));
});

gulp.task('spec', function (done) {
  process.env.BABEL_ENV = 'test';
  jest.runCLI({
    onlyChanged: false,
    testFileExtensions: ["js"],
    moduleFileExtensions: ["js", "jsx", "json"]
  }, './spec', () => { done(); });
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['spec']);
  gulp.watch('./spec/*.js', ['spec']);
});

gulp.task('default', ['build_lib', 'build_esm_lib', 'build_min_lib'], function () {});