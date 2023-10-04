export default function renameClass(
  className: string,
  postfix: string,
  classesInCss?: Set<string>,
) {
  const classes = className.split(/\s+/);
  const renamedClasses = classes
    .filter((c) => c)
    .map((c) => c.trim())
    .map((c) => {
      if (!classesInCss || classesInCss.has(c)) {
        if (c.endsWith(postfix)) return c;

        return c + '_' + postfix;
      }

      return c;
    })
    .join(' ');

  const renamedWithPreservedSpaces = className.replace(
    className.trimStart().trimEnd(),
    renamedClasses,
  );

  return renamedWithPreservedSpaces;
}
