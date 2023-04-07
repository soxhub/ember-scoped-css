module.exports = function (className, postfix, classesInCss) {
  const classes = className.split(/\s+/);
  return classes
    .map((c) => (!classesInCss || classesInCss.has(c) ? c + '_' + postfix : c))
    .join(' ');
};
