const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

const singleStart = process.env.SINGLE_START;

const suite = 'test/testBundle.js';

module.exports = function(karma) {

  const config = {

    frameworks: [
      'mocha',
      'webpack'
    ],

    files: [
      suite
    ],

    preprocessors: {
      [suite]: [ 'webpack', 'env' ]
    },

    reporters: [ 'tldr' ],

    browsers: browsers,

    autoWatch: false,
    singleRun: true,

    webpack: {
      mode: 'development',
      resolve: {
        modules: [
          'node_modules'
        ]
      },
      module: {
        rules: [
          {
            test: /\.json$/,
            type: 'json'
          }
        ]
      },
      devtool: 'eval-source-map'
    }
  };

  if (singleStart) {
    config.browsers = [].concat(config.browsers, 'Debug');
    config.envPreprocessor = [].concat(config.envPreprocessor || [], 'SINGLE_START');
  }

  karma.set(config);
};
