var gulp = require('gulp');

gulp.task('default', function() {
    gulp.src("node_modules/bootstrap/dist/css/*").pipe(gulp.dest("css")).pipe(gulp.dest("app/css"));
    gulp.src("node_modules/font-awesome/css/*").pipe(gulp.dest("css")).pipe(gulp.dest("app/css"));
    gulp.src("node_modules/font-awesome/fonts/*").pipe(gulp.dest("fonts")).pipe(gulp.dest("app/fonts"));
    
    gulp.src("img/*").pipe(gulp.dest("app/img"));
});
