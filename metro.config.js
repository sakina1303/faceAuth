const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce the number of files being watched to prevent EMFILE errors
config.watchFolders = [];
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

// Limit concurrent transformations
config.maxWorkers = 2;

// Disable file watching for better performance on macOS
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

module.exports = config;
