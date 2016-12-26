var gulp = require('gulp'),//获取gulp对象
    //clean = require('gulp-clean'),//清空文件夹
    del = require('del'),//删除文件 替代clean
    htmlmin = require('gulp-htmlmin'),//html压缩ok
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    minifycss = require('gulp-minify-css'),//css压缩ok
    uglify = require('gulp-uglify'),//压缩JS
    //rev = require('gulp-rev'), //更改版本名
    //collector = require('gulp-rev-collector'),//gulp-rev的插件，用于html文件更改引用路径
    rename = require('gulp-rename'),//文件更名ok
    notify = require('gulp-notify');//提示信息ok
var src = 'app/';
var config = {
    index: src + 'index.html',
    html: src + 'tpl/**/*.html',
    js: src+"js/**/*.js",
    css: src + 'css/style.css',
    locale: src + 'l10n/*.js',
    src: src,
    images: [src +'img/*.png',src +'img/*.ico'],
    build: 'dist/'
};

//删除文件
function clean(path) {
    del(path);
}

gulp.task('clean-style', function(){
    var files = config.build + 'css/*.css';
    clean(files);
});
gulp.task('clean-html', function(){
    var files = [].concat(
        config.build + 'tpl/**/*',
        config.build + 'index.html');
    clean(files);
});
gulp.task('clean-index', function(){
    var files = config.build + 'index.html';
    clean(files);
});
gulp.task('clean-images', function(){
    var files = config.build + 'img/*';
    clean(files);
});
gulp.task('clean-js', function(){
    var files = config.build + 'js/*';
    clean(files);
});
gulp.task('clean-locale', function(){
    var files = config.build + 'l10n/*.js';
    clean(files);
});

//压缩HTML文件
gulp.task('html',['clean-html'],function(){
    var options = {
        removeComments:true,//清除HTML注释
        collapseWhitespace:true,//压缩HTML
        collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true  //删除所有空格作属性值 <input id="" /> ==> <input />
    };
    gulp.src(config.html)
        //压缩文件
        .pipe(htmlmin(options))
        //另存为压缩后的文件
        .pipe(gulp.dest(config.build + 'tpl'))
        .pipe(notify({message:'html task ok'}))
});
//压缩index.HTML文件
gulp.task('index',['clean-index'],function(){
    var options = {
        // removeComments:true,//清除HTML注释
        collapseWhitespace:true//压缩HTML
        /*collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true  //删除所有空格作属性值 <input id="" /> ==> <input />*/
    };
    gulp.src(config.index)
    //压缩文件
        .pipe(htmlmin(options))
        //另存为压缩后的文件
        .pipe(gulp.dest(config.build))
        .pipe(notify({message:'index.html task ok'}))
});
//压缩l10n文件
gulp.task('locale',['clean-locale'],function(){
    gulp.src(config.locale)
        .pipe(uglify())
        .pipe(gulp.dest(config.build+'l10n'))
        .pipe(notify({message:'locale.js task ok'}))
});
//压缩JS文件
gulp.task('script',['clean-js'],function(){
    gulp.src(config.js)
        .pipe(uglify())
        .pipe(gulp.dest(config.build + 'js'))
        .pipe(notify({message:'js task ok'}))
});
//压缩css文件
gulp.task('css',['clean-style'],function(){
    gulp.src(config.css)
        .pipe(minifycss())
        .pipe(gulp.dest(config.build + 'css'))
        .pipe(notify({message:'css task ok'}))
});
//压缩图片文件
gulp.task('image',['clean-images'],function(){
    gulp.src(config.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
         }))
        .pipe(gulp.dest(config.build+'img'))
        .pipe(notify({message:'image task ok'}))
});
gulp.task('default',['index','html','locale','script','css','image']);