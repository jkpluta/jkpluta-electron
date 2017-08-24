var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var ejs = require("gulp-ejs");
var fs = require('fs');
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js');

var opts = { cache: false } //{ root: __dirname, cache: false, filename: path.join(__dirname, '.') };
var ejsPages = JSON.parse(fs.readFileSync('utils-ejs.json', 'utf8'))

gulp.task('default', function() {
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

    gulp.src("package-app.json")
    .pipe(rename("package.json"))
    .pipe(gulp.dest("app"));

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
