/* Server Code is a Instance of Full Application:
 * Server code that will be built will be the full application with
 * dependencies that render all routes (this include the shared code that is
 * the front end too) together with a express server that get bootstraped
 * straight after this webpack build.
 *
 * Server Code Runs in Node Environemnt on the Server:
 * + Note the 'target' option in this webpack build config file targets node
 *   runtime
 * + Note the exclusion of all modules to not be bundled, they are to be
 *   resolved as common.js modules by node, see the 'externals' config option
 * + Note plugins and all modules in build has to be resolved and manually
 *   imported as common.js modules
 * + Note the unofficial use of import for css styles
 *
 * Build for Static Assets:
 * Server instance is a full application that include all front end parts too
 * therefore most static assets, images, css, fonts loaders are present in the
 * build.
 *
 * Project Structure and Resolving:
 * Quoting webpack documentation, moduleDirecotries is resolved to the current
 * directory and it's ancestors meaning an option to structure
 *
 * Reasoning of Server Build:
 * Reasoning of server build is for ease of mind that the symetry between
 * server and client code setup brings, as well as having the same es2015
 * environment without having need to worry about node support.
 *
 * Build, Server and Client Code Separation:
 * The separation of build code, server and client code should be clear. NPM
 * start scripts, webpack configs are build code. The rest being all server
 * and client code.
 *
 * HMR and Hot Loader:
 * Hot Module Reload is concerned with the api and mechanice of when module
 * updates get notified. The feature and interface is satified usually by
 * webpack-dev-server or webpack-hot-middleware but in either case it is more
 * of a api definition and event hook as a part of the build tool.
 * React Hot Loader is a different thing that handles the page reload part
 * which would be a simple restart of the application server or update to the
 * react component in a de facto setup. What React Hot Loader does that
 * default setup doesn't not is the ability to update changes while preserving
 * component states.
 * React Loader is dropped by it's author in favor of React Transform which is
 * an Babel plugin followed by React Loader 3 currently in experimental state.
 */

var webpack = require('webpack')
var path = require('path')

var nodeExternals = require('webpack-node-externals')
var autoprefixer = require('autoprefixer')

module.exports = {
  target: 'node',
  entry: './app.js',
  output: {
    path: path.join(__dirname, '..', '..', 'build'),
    filename: 'app.js'
  },
  resolve: {
    root: path.join(__dirname, '..', '..'),
    moduleDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.json']
  },
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'stage-0', 'es2015'],
          plugins: [[
            'react-transform',
            {
              transforms: [{
                transform: 'react-transform-catch-errors',
                imports: ['react', 'redbox-react']
              }]
            }
          ]]
        }
      },
      {
        test: /\.(css|scss)/,
        loader: 'css-loader?modules&importLoaders=1&localIdentName=[path][name]__[local]--[hash:base64:5]!scss-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('require("source-map-support").install();', {
      raw: true,
      entryOnly: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],
  postcss: function () {
    return [autoprefixer]
  },
  devtool: 'sourcemap'
}
