const { stat } = require('fs').promises;

module.exports = async function (path) {
  try {
    await stat(path);
    return true;
  } catch (e) {
    return false;
  }
};
