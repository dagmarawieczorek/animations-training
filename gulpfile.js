
/// w katalogu znajdz katalog gump i w tym szukaj index js
const gulp = require("gulp");
const sass = require('gulp-sass');
const sourcemaps = require("gulp-sourcemaps");
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const c = require('ansi-colors');
const notifier = require('node-notifier');

function showError(err){
    notifier.notify({
        title: "Błąd kompliacji CSS",
        message: err.messageFormatted,
    });
    console.log(c.bold.red("~~~~~~~~~~~~"));
    console.log(c.bold.red(err.messageFormatted));
    console.log(c.bold.red("~~~~~~~~~~~~"));
    this.emit("end");
}

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        browser: "chrome"
    });
});

gulp.task('sass', function () {
    return gulp.src('./scss/main.scss')
        .pipe(plumber({
            errorHandler : showError
        }))//
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed" // nested expanded, compact, compressed
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream()); // odswieza css bez przeladowania strony
});

gulp.task("watch",function () {
    gulp.watch("./scss/**/*.scss", ["sass"]);
    gulp.watch("*.html").on('change', browserSync.reload);

})

gulp.task("default", function () {
    console.log(c.bgYellow("~rozpoczecie pracy"));
    gulp.start(["sass", 'browser-sync', "watch"])
});


