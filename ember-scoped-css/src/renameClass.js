const getPostfix = require('./getPostfix');

module.exports = function (className, projectCssPath) {
  return className + '_' + getPostfix(projectCssPath);
};
