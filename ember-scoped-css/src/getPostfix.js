const md5 = require('blueimp-md5');

module.exports = function (cssFileName) {
  if (cssFileName.includes('/')) {
    throw new Error('cssFileName should not contain /');
  }

  return 'e' + md5(cssFileName).substring(0, 8);
};
