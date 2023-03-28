const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    entry: './src/electron.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }],
        },
        {
          test: /.node$/,
          loader: 'node-loader',
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [{
              loader: 'file-loader'
          }]
        }
      ],
    },
    output: {
      path: __dirname + '/build',
      filename: 'electronBuild.js',
    },
  },
  {
    mode: 'development',
    entry: './src/App.tsx',
    target: 'electron-renderer',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }],
        },
        {
          test: /\.jsx?/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'],
              exclude: [/node_modules/],
            },
          },
        },
        {
          test: /.(css|scss)$/,
          exclude: /node_modules\/(?!(prism-themes|prismjs)\/).*/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    output: {
      path: __dirname + '/build',
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
    ],
  },
];
