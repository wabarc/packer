export const createFilename = (uri: string, title: string): string => {
  const extension = 'html';
  let filename = `unknown.${extension}`;
  let url: URL;

  try {
    url = new URL(decodeURI(uri));
  } catch (_) {
    return filename;
  }

  const hostname = url.hostname
    .replace(/\./g, '-')
    .replace(/www-/, '')
    .replace(/^-+|-+$/gm, '');
  if (url.pathname.length < 1) {
    filename = `${hostname}-${title}`.substring(0, 95);
    return `${filename}.{extension}`;
  }

  const pathname = url.pathname.replace(/\//g, '-').replace(/^-+|-+$/gm, '');
  const fullpath = `${hostname}-${pathname}`.replace(/^-+|-+$/gm, '').substring(0, 95);

  return `${fullpath}.${extension}`;
};
