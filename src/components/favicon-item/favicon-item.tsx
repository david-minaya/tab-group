import * as React from 'react';
import style from './favicon-item.css';
import { Tab } from '../../models';

interface props {
  page: Tab;
}

export function FaviconItem({ page }: props) {

  const [showText, setShowText] = React.useState(false);
  const itemRef = React.useRef<HTMLDivElement>();
  const textRef = React.useRef<HTMLDivElement>();

  function handleMouseEnter() {

    const textElement = textRef.current;
    const itemElement = itemRef.current;
    const itemRect = itemElement.getBoundingClientRect();
    const textRect = textElement.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const rightMargin = 12;

    const itemCenter = itemRect.left + (itemRect.width / 2);
    const textLeft = itemCenter - (textRect.width / 2);
    const textRight = textLeft + textRect.width + rightMargin;
    const textTop = itemRect.top - 32;
    const textRightAlign = (bodyWidth - textRect.width) - rightMargin;
    
    const isMinus = textRight < bodyWidth;
    const leftPosition = isMinus ? textLeft : textRightAlign;
    
    textElement.style.left = `${leftPosition}px`;
    textElement.style.top = `${textTop}px`;
    
    setShowText(true);
  }

  function handleOpenPage() {
    chrome.tabs.update({ url: page.url });
    window.close();
  }

  return (
    <div 
      className={style.faviconItem}
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowText(false)}
      onClick={handleOpenPage}>
      <div 
        className={showText ? style.text : style.hideText}
        ref={textRef}>
        <span>{page.name}</span>
      </div>
      <img className={style.icon} src={page.favIconUrl}/>
    </div>
  );
}
