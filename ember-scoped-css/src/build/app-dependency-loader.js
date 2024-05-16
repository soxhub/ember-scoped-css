import { existsSync } from 'node:fs';

export default function (source) {
  if (this.resourcePath.endsWith('.js')) {
    const hbsExists = existsSync(this.resourcePath.replace(/\.js/, '.hbs'));

    if (hbsExists) {
      return source;
    }
  }

  const cssPath = this.resourcePath.replace(/(\.js)|(\.hbs)/, '.css');
  const cssExists = existsSync(cssPath);

  if (cssExists) {
    this.addDependency(cssPath);
  }

  return source;
}
