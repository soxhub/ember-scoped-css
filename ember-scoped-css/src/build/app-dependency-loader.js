import { exists } from '../lib/path/utils.js';

export default async function (source) {
  if (this.resourcePath.endsWith('.js')) {
    const hbsExists = await exists(this.resourcePath.replace(/\.js/, '.hbs'));

    if (hbsExists) {
      return source;
    }
  }

  const cssPath = this.resourcePath.replace(/(\.js)|(\.hbs)/, '.css');
  const cssExists = await exists(cssPath);

  if (cssExists) {
    this.addDependency(cssPath);
  }

  return source;
}
