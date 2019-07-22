const fs = require('fs')
const gulp = require('gulp')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const changed = require('gulp-changed')
const browserSync = require('browser-sync').create()
const wrap = require('./gulp-wrap')

const srcPath = '../src/'
const distPath = '../dist/'
const excludedFiles = /(jparticles(\.all)?\.js|maps)\s/g
const reload = browserSync.reload

// Compile all scripts.
gulp.task('compile', () => {
  return gulp
    .src(`${srcPath}*.js`)
    .pipe(changed(distPath))
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-decorators-legacy'],
      })
    )
    .pipe(wrap())
    .pipe(
      sourcemaps.write('./maps/', {
        includeContent: false,
        sourceRoot: `../${srcPath}`,
      })
    )
    .pipe(gulp.dest(distPath))
    .pipe(reload({ stream: true }))
})

// Generate "jparticles.all.js".
gulp.task('packing', ['compile'], () => {
  let files = fs.readdirSync(distPath)

  files = files.join(' ').replace(excludedFiles, '')
  files = ('jparticles.js ' + files).split(' ')
  files = files.map(filename => {
    return distPath + filename
  })

  return gulp
    .src(files)
    .pipe(concat('jparticles.all.js'))
    .pipe(gulp.dest(distPath))
})

// Static service.
gulp.task('service', ['packing'], () => {
  browserSync.init({
    server: {
      baseDir: ['../', '../samples/'],
    },
    startPath: '/particle.html',
    injectChanges: false,
    open: !(process.argv.indexOf('no-open') !== -1),
  })

  gulp.watch(`${srcPath}*.js`, ['packing'])
  gulp.watch('../samples/**/*.@(html|css|js)').on('change', reload)
})

gulp.task('default', ['service'])
