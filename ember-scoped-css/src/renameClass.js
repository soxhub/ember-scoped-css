const getPostfix = require('./getPostfix');

module.exports = function (className, projectCssPath) {
  const classes = className.split(/\s+/);
  const postfix = getPostfix(projectCssPath);
  return classes.map((c) => c + '_' + postfix).join(' ');
};
