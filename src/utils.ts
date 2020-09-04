export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 *
 * @param path Input path that needed to be processed
 *
 * @returns {String} Processed string that starts with '/disk' prefix and don't have slash at end
 */
export const processPath = (path: string): string => {
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
