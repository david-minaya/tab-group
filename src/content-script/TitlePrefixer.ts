export default class TitlePrefixer {

  prefix: string;
  cb: (originalTitle: string) => void
  titleElement: HTMLElement;
  oldTitle = '';

  constructor(prefix: string, cb: (originalTitle: string) => void) {
    this.prefix = prefix;
    this.cb = cb;
    this.titleElement = document.querySelector('title');
  }

  prefixTitle() {

    const title = this.titleElement.textContent;
    const regex = new RegExp(`^(${this.prefix} | )`);
    const isPrefixed = regex.test(title);
    let newTitle = `${this.prefix} | `;

    if (isPrefixed) {
      const extractedTitle = title.match(/^(?:.* \| )(.*)/)[1];
      newTitle += extractedTitle;
    } else {
      newTitle += title;
    }

    if (newTitle !== this.oldTitle) {
      this.titleElement.textContent = newTitle;
      this.cb(title);
    }

    this.oldTitle = newTitle;
  }
}
