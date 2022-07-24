const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
  const newConfig = {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        react: path.resolve('./node_modules/react'),
        '@types/react': path.resolve('./node_modules/@types/react'),
      },
      plugins: config.resolve.plugins.filter((plugin) => !(plugin instanceof ModuleScopePlugin)),
    },
  };

  return newConfig;
};
