var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var ejs = require("gulp-ejs");
var sass = require('gulp-sass');

var fs = require('fs');
var webpack = require('webpack')

function ejsToHtml(target, theme, base, dst) {
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

gulp.task('default', function() {

    gulp.src('./sass/dark.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));

    gulp.src('./sass/light.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));

    gulp.src('./sass/bootstrap.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));

    gulp.src("electron_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("fonts"));

});

gulp.task('io', function() {

    return gulp.src('./sass/dark.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('../jkpluta.github.io/css'));

});

gulp.task('app', function() {

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
      
    gulp.src('./sass/dark.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('app/css'));

    gulp.src("fonts/*")
    .pipe(gulp.dest("app/fonts"));
    
    gulp.src("img/*")
    .pipe(gulp.dest("app/img"));

    gulp.src("build/*")
    .pipe(gulp.dest("app/build"));

    ejsToHtml('electron', 'dark', '..', 'app/html')
    
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

    try {
        fs.mkdirSync('www');
    } catch (err) {
    }
    
    var package = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    var www = JSON.parse(fs.readFileSync('package-www.json', 'utf8'));
    www.name = package.name;
    www.version = package.version;
    www.description = package.description;
    www.author = package.author;
    www.license = package.license;
    fs.writeFileSync('www/package.json', JSON.stringify(www), { encoding: 'utf8'})
      
    gulp.src('./sass/bootstrap.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('www/public/css'));

    gulp.src("fonts/*")
    .pipe(gulp.dest("www/public/fonts"));
    
    gulp.src("img/*")
    .pipe(gulp.dest("www/public/img"));

    gulp.src("./img/icon.ico")
    .pipe(rename("favicon.ico"))
    .pipe(gulp.dest("www/public"));

    ejsToHtml('www', 'bootstrap', '.', 'www/public')
    
    webpack(require('./webpack.config.www.js'), function (err, stats) {
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

gulp.task('cordova', function() {

    var package = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    var www = JSON.parse(fs.readFileSync('../jkpluta-cordova/package.json', 'utf8'));
    www.name = package.name;
    www.version = package.version;
    www.description = package.description;
    www.author = package.author;
    www.license = package.license;
    fs.writeFileSync('../jkpluta-cordova/package.json', JSON.stringify(www), { encoding: 'utf8'})
      
    gulp.src('./sass/bootstrap-material-design.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(rename('style.css'))
    .pipe(gulp.dest("../jkpluta-cordova/www/css"));
    
    gulp.src("fonts/*")
    .pipe(gulp.dest("../jkpluta-cordova/www/fonts"));
    
    gulp.src("img/*")
    .pipe(gulp.dest("../jkpluta-cordova/www/img"));

    ejsToHtml('www', 'bootstrap-material-design', '.', '../jkpluta-cordova/www')
    
    webpack(require('./webpack.config.cordova.js'), function (err, stats) {
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

gulp.task('nginx', function() {

    var dir = '/var/www/html';

    gulp.src("css/*")
    .pipe(gulp.dest(dir + "/css"));
    
    gulp.src("fonts/*")
    .pipe(gulp.dest(dir + "/fonts"));
    
    gulp.src("img/*")
    .pipe(gulp.dest(dir + "/img"));

    gulp.src("./img/icon.ico")
    .pipe(rename("favicon.ico"))
    .pipe(gulp.dest(dir));

    ejsToHtml('www', 'dark', '.', dir)
    
    webpack(require('./webpack.config.nginx.js'), function (err, stats) {
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

