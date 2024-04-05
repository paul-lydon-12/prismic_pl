export const getFileExt = (src = '') => {
  return src.toLowerCase().match(/\.([\w]+)(?:[?#]|$)/)?.[1];
};
