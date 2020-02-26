export default function getFaviconURL() {
  const favicon1 = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
  const favicon2 = favicon1 || document.head.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
  return favicon2.href;
}
