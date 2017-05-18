var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var concat = require('gulp-concat');
//var minify = require('gulp-minify-css');
var gzip = require('gulp-gzip');
var imagemin = require('gulp-imagemin');

// Set the banner content
var banner = ['/*!\n',
    ' * 3ee Framework - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/creative.less')
        .pipe(less())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('css/creative.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/creative.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('optimize-js', function(){
   return gulp.src(['js/vendor/jquery/jquery.js',
             'js/vendor/bootstrap/bootstrap.js',
             'js/vendor/jquery/jquery.easing.min.js',
             'js/vendor/scrollreveal/scrollreveal.js',
             'js/vendor/magnific-popup/jquery.magnific-popup.js',
             'js/creative.js'
            ],
        {base: 'js/'})

   .pipe(concat('script.js'))
   .pipe(uglify())
   .pipe(gzip({ append: false }))
   .pipe(gulp.dest('build/'));
});

gulp.task('optimize-css', function(){
   return gulp.src([
      'css/vendor/bootstrap/css/bootstrap.css',
      'css/vendor/font-awesome/css/font-awesome.css',
      'css/vendor/magnific-popup/magnific-popup.css',
      'css/creative.css'
     ],
       {base: 'css/'})

   .pipe(concat('styles.css'))
   .pipe(cleanCSS())
   .pipe(gzip({ append: false }))
   .pipe(gulp.dest('build/'));
});


gulp.task('optimize-img', function(){
	return gulp.src([
            'img/*',
            'img/portfolio/fullsize/*',
            'img/portfolio/thumbnails/*'
        ],
        {base: 'img/'})
		.pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ]))
		.pipe(gulp.dest('build/images'))
});

// Copy font libraries from /node_modules into /fonts
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('js/vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('js/vendor/jquery'))

    gulp.src(['node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('js/vendor/magnific-popup'))

    gulp.src(['node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('js/vendor/scrollreveal'))


    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('fonts/font-awesome'))
})

// Run everything
gulp.task('default', ['less', 'copy', 'optimize-css', 'optimize-js', 'optimize-img']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        }
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'optimize-css', 'optimize-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['optimize-css']);
    gulp.watch('js/*.js', ['optimize-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});
