
const { src, dest, series, watch } = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const svgSprite = require('gulp-svg-sprite')
const image = require('gulp-image')
const babel = require('gulp-babel')
const notify = require('gulp-notify')
const uglify = require('gulp-uglify-es').default
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const browserSync = require('browser-sync').create()
const gulpIf = require('gulp-if')

let prod = false

const isProd = (done) => {
  prod = true
  done()
}

const clean = () => {
  return del(['dist'])
}

const fonts = () => {
  return src('src/fonts/**')
    .pipe(dest('dist/fonts'))
}

const styles  = () => {
  return src('src/styles/**/*.css')
  .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level:2
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(gulpIf(prod, htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const svgSprites = () => {
  return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/images'))
}


const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const images = () => {
  return src([
      'src/images/**/*.svg',
      'src/images/**/*.webp'
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
}



watch('src/**/*.html', htmlMinify)
watch('src/styles/**/*.css', styles)
watch('src/images/svg/**/*.svg', svgSprites)
watch('src/fonts/**', fonts)


exports.styles =  styles
exports.htmlMinify = htmlMinify
// exports.dev = series(clean, resources, htmlMinify,  styles, images,  svgSprites, watchFiles)
// exports.build = series(isProd, clean, resources, htmlMinify,  styles, images,  svgSprites)
exports.default = series(clean, fonts, htmlMinify, styles, images, watchFiles, svgSprites)
