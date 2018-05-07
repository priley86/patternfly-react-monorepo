const path = require('path');
const pkg = require('../package.json');
const { readdirSync, statSync } = require('fs');
const { parse } = require('path');

const ROOT_DIR = '..';
const PCKGS = `${ROOT_DIR}/packages`;

const packages = readdirSync(path.resolve(__dirname, PCKGS))
  .filter(onePckg =>
    statSync(path.resolve(__dirname, `${PCKGS}/${onePckg}`)).isDirectory()
  )
  .map(file => parse(file).name)
  .reduce(
    (acc, curr) => [...acc, path.resolve(__dirname, `${PCKGS}/${curr}`)],
    []
  );

module.exports = (baseConfig, env, defaultConfig) => {
  // add the root path for so root references can be used in stories
  defaultConfig.resolve.modules.push(path.resolve(__dirname, '../'));

  defaultConfig.module.rules.push(
    // Storysource Addon
    {
      test: /\.stories\.jsx?$/,
      loaders: [require.resolve('@storybook/addon-storysource/loader')],
      enforce: 'pre'
    },
    // Css
    {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
      include: [
        ...packages.map(onePck => `${onePck}/src'`),
        path.resolve(__dirname, './')
      ]
    },
    // Sass
    {
      test: /\.scss$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [
              ...packages.map(onePck => `${onePck}/sass/`),
              ...Object.values(pkg.sassIncludes).map(includePath =>
                path.resolve(__dirname, `../${includePath}`)
              )
            ]
          }
        }
      ]
    },
    // Images
    {
      test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      query: {
        limit: 8192, // inline base64 URLs for <=8k images, direct URLs for the rest
        name: '[name].[ext]'
      }
    },

    // Fonts and svg images
    {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      query: {
        limit: 8192,
        mimetype: 'application/font-woff',
        name: '[name].[ext]'
      }
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      query: {
        limit: 8192,
        mimetype: 'application/octet-stream',
        name: '[name].[ext]'
      }
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      query: { name: '[name].[ext]' }
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      query: {
        limit: 8192,
        mimetype: 'image/svg+xml',
        name: '[name].[ext]'
      }
    }
  );

  return defaultConfig;
};
