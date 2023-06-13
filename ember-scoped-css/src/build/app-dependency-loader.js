import fsExists from '../lib/fsExists.js';

export default async function (source) {
  if (this.resourcePath.endsWith('.js')) {
    const hbsExists = await fsExists(this.resourcePath.replace(/\.js/, '.hbs'));

    if (hbsExists) {
      return source;
    }
  }

  const cssPath = this.resourcePath.replace(/(\.js)|(\.hbs)/, '.css');
  const cssExists = await fsExists(cssPath);

  if (cssExists) {
    this.addDependency(cssPath);
  }

  return source;
}
