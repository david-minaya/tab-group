import './content-script.css';

const iframe = document.createElement('iframe');
iframe.classList.add('iframe');
document.body.append(iframe);
iframe.src = chrome.runtime.getURL('tab-bar-page.html');
