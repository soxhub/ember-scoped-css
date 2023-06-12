export default function isInsideGlobal(node, func) {
  const parent = node.parent;

  if (!parent) return false;
  if (parent.type === 'pseudo' && parent.value === ':global') return true;

  return isInsideGlobal(parent, func);
}
