export default function (css) {
  const regex = /@import\s+["']?([^"')]+)["']?;/g;
  const importedCssPaths = [];
  let match;

  while ((match = regex.exec(css))) {
    const importPath = match[1];
    if (!importPath.includes('http') && !importPath.startsWith('url(')) {
      css = css.replace(match[0], '');
      importedCssPaths.unshift(importPath);
    }
  }

  return {
    css,
    importedCssPaths,
  };
}
