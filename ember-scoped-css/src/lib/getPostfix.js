import generateHash from './generateHash.js';
import path from 'path';

export default function (cssFileName) {
  const relativePath = path.relative(process.cwd(), cssFileName);
  return generateHash(relativePath);
}
