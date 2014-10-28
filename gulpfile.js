'use strict';

var gulp = require('gulp');
var page = require('./package.json')
// js
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
// css
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var minifyCSS = require('gulp-minify-css');
// html
var jade = require('gulp-jade');
var htmlv = require('gulp-html-validator');
// img
var imagemin = require('gulp-imagemin');
var sprite = require('gulp.spritesmith');
// watch
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

gulp.task('js', function(){
	gulp.src('./src/js/*.js')
	.pipe(jshint())
	.pipe(uglify())
	.pipe(gulp.dest('./public/js'))
	.pipe(connect.reload())
});

gulp.task('css', function(){
	gulp.src('./src/stylus/*.styl')
	.pipe(stylus())
	.pipe(autoprefixer(['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 9']))
	.pipe(csscomb({config: '.csscomb.json'}))
	.pipe(minifyCSS({
		keepSpecialComments:0
	}))
	.pipe(gulp.dest('./public/css'))
	.pipe(connect.reload())
});

gulp.task('html', function(){
	gulp.src('./src/views/*.jade')
	.pipe(jade({
		locals:{
			page:page
		}
	}))
	.pipe(gulp.dest('./public'))
	.pipe(connect.reload())
});

gulp.task('htmlvalidate', function(){
	gulp.src('./public/*.html')
	.pipe(htmlv({format: 'html'}))
	.pipe(gulp.dest('./htmlvalidate'))
});

gulp.task('img', function(){
	gulp.src('./src/img/*.{png,jpg,gif}')
	.pipe(imagemin())
	.pipe(gulp.dest('./public/img'))
	.pipe(connect.reload())
});

gulp.task('sprite', function(){
	var spriteData =
		gulp.src('./src/img/sprite/*.*')
		.pipe(sprite({
			imgName: 'sprite.png',
			cssName: 'sprite.styl',
		}));
	spriteData.img.pipe(gulp.dest('./public/img'));
	spriteData.css.pipe(gulp.dest('./src/stylus'));
});

gulp.task('connect', function() {
  connect.server({
    root: './public',
    livereload: true
  });
});

gulp.task('watch', function(){
	gulp.watch('./src/**/*.styl', ['css']);
	gulp.watch('./src/**/*.js', ['js']);
	gulp.watch('./src/**/*.jade', ['html']);
});

gulp.task('htmlval', ['htmlvalidate']);
gulp.task('live', ['css', 'js', 'html', 'img', 'sprite', 'watch', 'connect']);
gulp.task('default', ['css', 'js', 'html', 'img', 'sprite']);