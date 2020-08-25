const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// eslint-disable-next-line unused-imports/no-unused-vars-ts
const srcDir = path.resolve(__dirname, 'src')
const distDir = path.resolve(__dirname, 'dist')
const samplesDir = path.resolve(__dirname, 'samples')

const htmlPages = []
const indexHtmlContent = []

fs.readdirSync(samplesDir).forEach((filename) => {
  if (/\.html$/i.test(filename)) {
    indexHtmlContent.push(`<li><a href="${filename}">${filename}</a></li>`)
    htmlPages.push(
      new HtmlWebpackPlugin({
        filename,
        template: samplesDir + '/' + filename,
        inject: 'head',
      })
    )
  }
})

module.exports = {
  entry: {
    jparticles: './src/index.ts',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].[hash:8].js',
    path: distDir,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: distDir,
    host: '127.0.0.1',
    port: 9000,
    hot: true,
    open: true,
    disableHostCheck: true,
    overlay: true,
    clientLogLevel: 'silent',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: `${samplesDir}/css`, to: `${distDir}/css` },
      { from: `${samplesDir}/js`, to: `${distDir}/js` },
      { from: `${samplesDir}/img`, to: `${distDir}/img` },
    ]),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'index.html',
      templateContent: `
        <html>
          <body>
            <h1>Samples:</h1>
            <ul style="line-height: 2;">${indexHtmlContent.join('')}</ul>
          </body>
        </html>
      `,
    }),
    ...htmlPages,
  ],
}
