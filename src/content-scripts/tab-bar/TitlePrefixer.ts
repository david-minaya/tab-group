export default class TitlePrefixer {

  prefix: string;
  cb: (originalTitle: string) => void
  titleElement: HTMLElement;

  constructor(prefix: string, cb: (originalTitle: string) => void) {
    this.prefix = prefix;
    this.cb = cb;
    this.titleElement = document.querySelector('title');
  }

  prefixTitle() {

    const title = this.titleElement.textContent;
    const regex = /^(.*\s\|\s)/;
    const isPrefixed = regex.test(title);
    
    if (isPrefixed) {
      const extractedTitle = title.match(/^(?:.* \| )(.*)/)[1];
      this.cb(extractedTitle);
    } else {
      this.titleElement.textContent = `${this.prefix} | ` + title;
      this.cb(title);
    }
  }
}
