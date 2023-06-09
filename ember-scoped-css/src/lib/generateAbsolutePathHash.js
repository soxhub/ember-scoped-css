import path from 'path';

import generateHash from './generateRelativePathHash.js';

export default function (cssFileName) {
  const relativePath = path.relative(process.cwd(), cssFileName);

  return generateHash(relativePath);
}
