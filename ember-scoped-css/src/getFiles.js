import glob from 'glob';

export default function (globPath) {
  return new Promise((resolve, reject) => {
    glob(globPath, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
}
