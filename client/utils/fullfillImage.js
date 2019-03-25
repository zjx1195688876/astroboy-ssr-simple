const fullfillImage = (url, rule) => {
  if (!rule) {
    return url;
  }
  const w = rule.split('!')[1].split('x')[0] || 0;
  const h = rule.split('!')[1].split('x')[1].split('.')[0] || 0;
  return `${url}?imageView2/2/w/${w}/h/${h}/q/75/format/webp`;
}

export default fullfillImage;