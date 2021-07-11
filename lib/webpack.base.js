const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');

// 冒烟测试寻找入口时兼容 realPath替换__dirname
const realPath = process.cwd();

// setMultiPage多入口打包，这个方法用来寻找打包的入口和设置相同数量的HtmlWebpackPlugin
const setMultiPage = () => {
  const entryList = glob.sync(path.join(realPath, './src/*/index.js'));
  const entry = {};
  const htmlWebpackPlugins = [];
  entryList.forEach((item) => {
    const entryName = item && item.match(/src\/(.*)\/index\.js/)[1];
    entry[entryName] = item;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(realPath, `./src/${entryName}/index.html`),
        filename: `${entryName}.html`,
        chunks: [entryName], // 这里要不要引入vendor呢？
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        }
      })
    )
  })
  return { entry, htmlWebpackPlugins };
};

const { entry, htmlWebpackPlugins } = setMultiPage();

module.exports = {
  entry,
  output: {
    path: path.join(realPath, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          // 'eslint-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 versions', '>1%', 'IOS 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 提取css文件
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    // 自动清除output文件夹
    new CleanWebpackPlugin(),
    // 构建日志显示和错误捕获
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
  stats: 'errors-only',
};
