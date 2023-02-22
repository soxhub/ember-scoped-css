const fsExists = require('./fsExists');

module.exports = async function (source) {
  const cssPath = this.resourcePath.replace(/(\.js)|(\.hbs)/, '.css');
  const cssExists = await fsExists(cssPath);

  // add dependency for unnecessary files, probably hbs and js of the same file.
  if (cssExists) {
    this.addDependency(cssPath);
  }

  return source;
};
