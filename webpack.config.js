const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env = {}) => {
  const isProduction = env.NODE_ENV === 'production';
  const isEdge = env.target === 'edge';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/mobilenovin-ai.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isEdge ? 'mobilenovin-ai-edge.js' : 'mobilenovin-ai.js',
      library: 'MobileNovinAI',
      libraryTarget: 'umd',
      globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    target: 'node',
    resolve: {
      extensions: ['.js', '.json']
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
              pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : []
            },
            mangle: {
              reserved: ['MobileNovinAI']
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    },
    externals: {
      // Don't bundle Node.js built-in modules
      'fs': 'commonjs fs',
      'path': 'commonjs path',
      'crypto': 'commonjs crypto',
      'os': 'commonjs os'
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: isEdge ? 51200 : 512000, // 50KB for edge, 500KB for standard
      maxAssetSize: isEdge ? 51200 : 512000
    },
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  };
};