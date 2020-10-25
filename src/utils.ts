export const createFilename = (uri: string, title: string): string => {
  const extension = 'html';
  let filename = `unknown.${extension}`;
  let url: URL;

  try {
    url = new URL(decodeURI(uri));
  } catch (_) {
    return filename;
  }

  if (typeof title === 'string') {
    title = title.replace(/\n|\r|\r\n/gm, '');
  }

  const sanitize = (str: string) => {
    if (typeof str !== 'string') {
      return str;
    }

    str = str.replace(/"<>#%\{\}\|\\\^~\[\]`;\?:@=&/g, '');

    return Buffer.from(str).toString('utf8');
  };

  const hostname = url.hostname
    .replace(/\./g, '-')
    .replace(/www-/, '')
    .replace(/^-+|-+$/gm, '');

  if (url.pathname.length < 1) {
    filename = `${hostname}-${title}`.substring(0, 95);
    return sanitize(`${filename}.{extension}`);
  }

  const pathname = url.pathname.replace(/:\/\/|\/|\./g, '-').replace(/^-+|-+$/gm, '');
  let fullpath = `${hostname}-${pathname}-${title}`.replace(/^-+|-+$/gm, '').substring(0, 95);
  if (url.search.length > 0) {
    // Prevent overriding the results of different query
    fullpath += Buffer.from(url.search).toString('base64').substr(-14, 12);
  }

  return sanitize(`${fullpath}.${extension}`);
};
