import { stat } from 'fs/promises';

export default async function (path) {
  try {
    await stat(path);
    return true;
  } catch (e) {
    return false;
  }
}
