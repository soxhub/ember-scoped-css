export default function (className, postfix, classesInCss) {
  const classes = className.split(/\s+/);
  const renamedClasses = classes
    .filter((c) => c)
    .map((c) => c.trim())
    .map((c) => (!classesInCss || classesInCss.has(c) ? c + '_' + postfix : c))
    .join(' ');

  const renamedWithPreservedSpaces = className.replace(
    className.trimStart().trimEnd(),
    renamedClasses
  );
  return renamedWithPreservedSpaces;
}
