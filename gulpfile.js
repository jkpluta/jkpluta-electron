var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var ejs = require("gulp-ejs");
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');

var fs = require('fs');
var webpack = require('webpack');
var browserify = require('browserify');
 
function gCopy(src, dst) {
    gulp.src(src)
    .pipe(gulp.dest(dst));
}

function gCopyRen(src, name, dst) {
    gulp.src(src)
    .pipe(rename(name))
    .pipe(gulp.dest(dst));
}

function gMkDir(dst) {
    try {
        fs.mkdirSync(dst);
    } catch (err) {
    }
}

function gCpDir(dir, dst) {
    gulp.src(dir + "/*")
    .pipe(gulp.dest(dst + "/" + dir));
}

function gCpDirs(dirs, dst) {
    for(idx in dirs)
        gCpDir(dirs[idx], dst);
}

function gEjs(target, theme, base, dst) {
    var ejsPages = JSON.parse(fs.readFileSync('./html/ejs.json', 'utf8'));
    var opts = { cache: false };
    for(var ejsName in ejsPages) {
        var ejsPage = ejsPages[ejsName];
        if (ejsPage.target == null || ejsPage.target === target) {
            ejsPage.target = target;
            ejsPage.theme = theme;
            ejsPage.base = base;
            gulp.src('./html/' + ejsPage.template + '.ejs')
            .pipe(ejs(ejsPage, opts))
            .pipe(rename(ejsName + '.html'))
            .pipe(gulp.dest(dst))
        }
    }
}

function gBrowserify(name, dst) {
    browserify('./js/' + name).bundle()
    .pipe(source(name))
    .pipe(gulp.dest(dst));
}

function gBrowserifyAll(dst) {
    gBrowserify('renderer.js', dst);
    gBrowserify('renderer-www.js', dst);
    gBrowserify('renderer-github.js', dst);
}

function gSass(theme, dst) {
    gulp.src('./sass/' + theme + '.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(dst));
}

function gJson(src, dst) {
    var package = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    var data = JSON.parse(fs.readFileSync(src, 'utf8'));
    data.name = package.name;
    data.version = package.version;
    data.homepage = package.homepage;
    data.description = package.description;
    data.author = package.author;
    data.license = package.license;
    fs.writeFileSync(dst + '/package.json', JSON.stringify(data, null, "  "), { encoding: 'utf8'})
}

function gPages(target, theme, dst) {
    gSass(theme, dst + '/css')
    gCpDirs(['fonts', 'img'], dst);
    gCopyRen("img/icon.ico", "favicon.ico", dst);
    gEjs(target, theme, '.', dst);
    gBrowserifyAll(dst + '/js');
}

gulp.task('default', function() {
    gSass('dark', './css');
    gSass('light', './css');
    gSass('bootstrap', './css');
    gCopy("node_modules/font-awesome/fonts/*", "./fonts");
});

gulp.task('io', function() {
    gSass('dark', '../jkpluta.github.io/css');
});

gulp.task('app', function() {
    gMkDir('app');
    gJson('package-app.json', 'app')
    gSass('dark', 'app/css')
    gCpDirs(['fonts', 'img', 'build'], 'app')
    gEjs('electron', 'dark', '..', 'app/html')
    webpack(require('./webpack.config.app.js'), function (err, stats) {
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

gulp.task('www', function() {
    gMkDir('www');
    gJson('package-www.json', 'www');
    gPages('www', 'bootstrap', 'www/public');
});

gulp.task('cordova', function() {
    gJson('../jkpluta-cordova/package.json', '../jkpluta-cordova');
    gPages('cordova', 'bootstrap-material-design', '../jkpluta-cordova/www');
});

gulp.task('nginx', function() {
    gPages('www', 'bootstrap', '/var/www/html');
});

