const fsExists = require('./fsExists');

module.exports = async function (source) {
  const cssPath = this.resourcePath.replace(/(\.js)|(\.hbs)/, '.css');
  const cssExists = await fsExists(cssPath);

  if (cssExists) {
    this.addDependency(cssPath);
  }

  return source;
};
