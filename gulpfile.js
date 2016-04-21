/**
 * 命令：gulp server 开启服务器
 * 命令：gulp dist   生成dist压缩版本
 * 命令：gulp upload 上传到服务器
 */

//------gulp server---------
var gulp        = require('gulp'),					//gulp
	browserSync = require('browser-sync'),			//实时刷新
	sass        = require('gulp-ruby-sass'),		//sass编译，注：需要安装ruby和sass
	autoprefix  = require('gulp-autoprefixer');		//浏览器前缀自动补齐

gulp.task('server', function(){
	//server
	browserSync({
		files: 'src/**',
		browser: 'google chrome',
		server: {
			baseDir: './'
		},
		startPath: 'src/html/index.html',
		open: 'external'
	});
	//watch sass
	gulp.watch('src/scss/**/*.scss', function(){
		sass('src/scss/*.scss')
		.on('error', sass.logError)
		.pipe(autoprefix())
		.pipe(gulp.dest('src/css/'));
	})
})

//--------gulp dist--------
var del 		   = require('del'),						//清空目录
	imagemin       = require("gulp-imagemin"),				//图片压缩
	jpegRecompress = require("imagemin-jpeg-recompress"),	//jpg压缩
	pngquant       = require("imagemin-pngquant"),			//png压缩
	minifyCss      = require('gulp-minify-css'),			//css压缩
	uglify         = require('gulp-uglify'),				//js压缩
	rev 		   = require('gulp-rev'),					//生成md5码和对应json
	revCollector   = require('gulp-rev-collector'),			//路径替换
	replace 	   = require('gulp-replace'),				//字符串替换
	gulpSequence   = require('gulp-sequence');				//gulp task任务排序执行

gulp.task('del-dist', function(){
	return del(['dist/**', 'rev/**', 'upload/**', '**/*.gitkeep'])
})
//min
gulp.task('min-jpg', function(){
	return gulp.src('src/img/**/*.jpg')
	.pipe(imagemin({use:[jpegRecompress({loops:6})]}))
	.pipe(rev())
	.pipe(gulp.dest('dist/img/'))
	.pipe(rev.manifest('jpg.json'))
	.pipe(gulp.dest('rev/'))
})
gulp.task('min-png', function(){
	return gulp.src('src/img/**/*.png')
	.pipe(imagemin({progressive:false,use:[pngquant()]}))
	.pipe(rev())
	.pipe(gulp.dest('dist/img/'))
	.pipe(rev.manifest('png.json'))
	.pipe(gulp.dest('rev/'))
})
gulp.task('copy-media', function(){
	return gulp.src('src/img/**/*.+(gif|mp3|mp4)')
	.pipe(rev())
	.pipe(gulp.dest('dist/img/'))
	.pipe(rev.manifest('media.json'))
	.pipe(gulp.dest('rev/'))
})
gulp.task('min-css', function(){
	return gulp.src('src/css/**/*.css')
	.pipe(minifyCss())
	.pipe(rev())
	.pipe(gulp.dest('dist/css/'))
	.pipe(rev.manifest('css.json'))
	.pipe(gulp.dest('rev/'))
})
gulp.task('copy-js', function(){
	return gulp.src('src/js/*.js')
	.pipe(rev())
	.pipe(gulp.dest('dist/js/'))
	.pipe(rev.manifest('js.json'))
	.pipe(gulp.dest('rev/'))
})
gulp.task('min-js', function(){
	return gulp.src('src/js/lib/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/lib/'))	
})

gulp.task('copy-html', function(){
	return gulp.src('src/html/**/*.html')
	.pipe(gulp.dest('dist/html/'))
})
//revCollector
gulp.task('revCollector', function(){
	gulp.src(['rev/*.json', 'dist/**/*.+(html|js|css)'])
	.pipe(revCollector())
	.pipe(gulp.dest('dist/'))
})

gulp.task('dist', gulpSequence('del-dist', ['min-jpg', 'min-png', 'copy-media', 'min-css', 'min-js', 'copy-js', 'copy-html'], 'revCollector'));

//--------gulp upload--------
var iconv = require('gulp-iconv'),	//编码转换
	open  = require('gulp-open'),	//开启浏览器地址
	ftp   = require('gulp-ftp');	//上传

var config_ftp = {
	domain: '',			//主路径
	host: '',			//host地址
	remotePath: '',		//子目录
	user: '',			//用户名
	pass: ''			//密码
};

gulp.task('UTFtoGBK', function(){
	return gulp.src('dist/**/*.+(html|js|css)')
	.pipe(replace('<meta charset="UTF-8">','<meta charset="GBK">'))
	.pipe(iconv({
		decoding: 'utf-8',
		encoding: 'GBK'
	}))
	.pipe(gulp.dest('upload/'))
})
gulp.task('copyAsset', function(){
	return gulp.src('dist/img/**')
	.pipe(gulp.dest('upload/img/'))
})
gulp.task('ftp', function(){
	return gulp.src('upload/**')
	.pipe(ftp({
		host: config_ftp.host,
		remotePath: config_ftp.remotePath,
		user: config_ftp.user,
		pass: config_ftp.pass
	}))
})
gulp.task('openOnline', function(){
	gulp.src('')
	.pipe(open({
		uri: config_ftp.domain + config_ftp.remotePath + '/html/index.html'
	}))
})

gulp.task('upload', gulpSequence(['UTFtoGBK', 'copyAsset'], 'ftp', 'openOnline'))


//-----------gulp default----------
gulp.task('default', function(){
	console.log('\n\n先配置参数：config_ftp \n命令:gulp server  ---------  开启本地服务器 \n命令:gulp dist    ---------  压缩生成dist版本 \n命令:gulp upload  ---------  上传到服务器 \n\n')
})