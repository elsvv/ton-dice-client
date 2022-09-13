type List = Record<string, any>[];

export function listEqualByKey(a: List, b: List, key: string): boolean {
  if (a === b) return true;

  const length = a.length;

  if (length !== b.length) return false;
  for (let i = length; i-- !== 0; ) if (a[i][key] !== b[i][key]) return false;
  return true;
}
