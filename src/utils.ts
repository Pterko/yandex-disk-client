export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const mergePath = (path: string) => {
  let addingPrefix = path.startsWith('/disk') ? '' : '/disk';

  const newPath = path.endsWith('/')
    ? path.substring(0, path.length - 1)
    : path;

  if (newPath.startsWith('/')) {
    return addingPrefix + newPath;
  } else {
    return addingPrefix + '/' + newPath;
  }
};
