const glob = require('glob');

module.exports = function (globPath) {
  return new Promise((resolve, reject) => {
    glob(globPath, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
};
