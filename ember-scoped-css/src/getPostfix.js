const md5 = require('blueimp-md5');
const path = require('path');

module.exports = function (cssFileName) {
  const relativePath = path.relative(process.cwd(), cssFileName);
  return 'e' + md5(relativePath).substring(0, 8);
};
