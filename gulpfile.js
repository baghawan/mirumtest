var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    compass     = require('gulp-compass'),
    cssnano     = require('gulp-cssnano'),
    concatJS    = require('gulp-concat'),
    clean       = require('gulp-clean'),
    fileinclude = require('gulp-file-include'),
    browserSync = require('browser-sync'),
    plumber     = require('gulp-plumber'),
    rev         = require('gulp-rev-mtime'),
    rename      = require('gulp-rename'),
    imageResize = require('gulp-image-resize'),     // $ brew install graphicsmagick && brew install imagemagick
    gulpSequence = require('gulp-sequence'),
    image       = require('gulp-image');


gulp.task('js', function(){
    gulp.src([
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            './node_modules/retinajs/dist/retina.min.js',
            './node_modules/owl.carousel/dist/owl.carousel.min.js',
            
            //custom
            './src/js/global.js'
        ])
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concatJS('script.js'))
        .pipe(gulp.dest('./app/assets'));
});

gulp.task('compass', function() {
    gulp.src('./src/sass/style.scss')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(compass({
            image: './app/assets/img',
            css: './app/assets',
            sass: 'src/sass'
        }))
        .pipe(gulp.dest('./app/assets'));
});

gulp.task('html', function() {
    gulp.src(
        './src/html/*.html')
            .pipe(plumber())
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest('./app'));
});

gulp.task('delete-app', function(){
    return gulp.src('./app', {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('delete-img', function(){
    return gulp.src('./app/assets/img', {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('assets', function(){
    gulp.src('./src/assets/**/*')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(gulp.dest('./app/assets'));
});

gulp.task('_library', function(){
    gulp.src('./src/_library/**/*')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(gulp.dest('./node_modules'));
    gulpSequence('compass');
});

gulp.task('image', function() {
    gulp.src('./src/assets/img/*')
        .pipe(image())
        .pipe(gulp.dest('./app/assets/img'));
});

gulp.task('minify-js', function(){
    gulp.src('./app/assets/script.js')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(uglify())
        .pipe(gulp.dest('./app/assets'));
});

gulp.task('minify-css', function(){
    gulp.src('./app/assets/style.css')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(cssnano({discardComments: {removeAll: true}}))
        .pipe(gulp.dest('./app/assets'));
});

gulp.task('clean', gulpSequence('_library','delete-app','compass','js','html','assets'));

gulp.task('minify', gulpSequence('minify-js','minify-css','delete-img','image'));

gulp.task('build', function () {
    gulp.src('./app/*.html')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(rev({
          'cwd': './app',
          'suffix': 'build'
        }))
        .pipe(gulp.dest('./app'));
});

gulp.task('watch',function(){
    browserSync.init({
        server: {
            baseDir: './app',
            directory: true
        },
        browser: 'google chrome',
        notify: false,
        cors: true
    });

    gulp.watch('./src/js/*.js',['js']);

    gulp.watch(['./src/sass/*.scss','./src/sass/*/*.scss'],['compass']);

    gulp.watch(['./src/html/*.html', './src/html/**/*.html'],['html']);


    gulp.watch([
        './app/*.html',
        './app/assets/*.js',
        './app/assets/*.css'
        ]).on('change', function() {
            browserSync.reload();
        });

    gulp.watch('./src/bower/**/*.scss').on('change', function() {
        gulpSequence('[bower], compass')
    });
});
