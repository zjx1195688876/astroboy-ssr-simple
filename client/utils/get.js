const get = (name, url) => {
  name = name.replace(/[[]/, '\\[').replace(/[]]/, '\\]');
  if (!url) return;
  url = '?' + url.split('#')[0].split('?')[1];
  const results = RegExp('[?&]' + name + '=([^&#]*)').exec(url);
  return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : '';
}

export default get;