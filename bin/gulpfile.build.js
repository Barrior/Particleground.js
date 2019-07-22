const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const through = require('through2')
const wrap = require('./gulp-wrap')

const fs = require('fs')
const pkg = require('../package.json')

const VERSION = pkg.version
const COPYRIGHT = `/**
 * JParticles v${VERSION} (https://github.com/Barrior/JParticles)
 * Copyright 2016-present Barrior <Barrior@qq.com>
 * Licensed under the MIT (https://opensource.org/licenses/MIT)
 */
`

const srcPath = '../src/'
const distPath = '../dist/'
const matchFile = /jparticles(\.all)?\.js/
const excludedFiles = /(jparticles(\.all)?\.js|maps)\s/g

gulp.task('compile', () => {
  return gulp
    .src(`${srcPath}*.js`)
    .pipe(
      babel({
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-decorators-legacy'],
      })
    )
    .pipe(wrap())
    .pipe(gulp.dest(distPath))
})

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

// Build JParticles.
gulp.task('build', ['packing'], () => {
  return gulp
    .src(`${distPath}*.js`)
    .pipe(uglify())
    .pipe(
      through.obj((file, encoding, callback) => {
        if (matchFile.test(file.path)) {
          let content = file.contents.toString()
          content = COPYRIGHT + content
          file.contents = new Buffer(content)
        }

        callback(null, file)
      })
    )
    .pipe(gulp.dest(distPath))
})

gulp.task('default', ['build'])
