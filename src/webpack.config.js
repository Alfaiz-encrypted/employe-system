const path = require('path');

module.exports = {
  // Other configuration options...
  resolve: {
    fallback: {
      https: require.resolve('https-browserify'),
      "https": require.resolve("https-browserify"),
      http: require.resolve('stream-http'),
      url: require.resolve('url'),
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      fs: false
    }
  }
};
