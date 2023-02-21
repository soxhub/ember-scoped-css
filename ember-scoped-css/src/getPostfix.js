const md5 = require('blueimp-md5');

module.exports = function (cssFileName) {
  return 'e' + md5(cssFileName).substring(0, 8);
};
