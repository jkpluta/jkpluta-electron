var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var ejs = require("gulp-ejs");
var fs = require('fs');
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js');

var opts = { cache: false };
var ejsPages = JSON.parse(fs.readFileSync('utils-ejs.json', 'utf8'));

gulp.task('default', function() {

    try {
        fs.mkdirSync('app');
    } catch (err) {
    }
    
    var package = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    var app = JSON.parse(fs.readFileSync('package-app.json', 'utf8'));
    app.name = package.name;
    app.version = package.version;
    app.description = package.description;
    app.author = package.author;
    app.license = package.license;
    fs.writeFileSync('app/package.json', JSON.stringify(app), { encoding: 'utf8'})
      
    gulp.src("node_modules/bootstrap/dist/css/*.min.css")
    .pipe(gulp.dest("css"))
    .pipe(gulp.dest("app/css"));
    
    gulp.src("node_modules/font-awesome/css/*.min.css")
    .pipe(gulp.dest("css"))
    .pipe(gulp.dest("app/css"));
    
    gulp.src("node_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("fonts"))
    .pipe(gulp.dest("app/fonts"));
    
    gulp.src("img/*")
    .pipe(gulp.dest("app/img"));

    gulp.src("build/*")
    .pipe(gulp.dest("app/build"));

    for(var ejsName in ejsPages) {
        var ejsPage = ejsPages[ejsName]
        gulp.src(ejsPage.template + '.ejs')
        .pipe(ejs(ejsPage, opts))
        .pipe(rename(ejsName + '.html'))
        .pipe(gulp.dest("app"))
    }

    webpack(webpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack] Completed\n' + stats.toString({
            assets: true,
            chunks: false,
            chunkModules: false,
            colors: true,
            hash: false,
            timings: false,
            version: false
        }));
    });

});
