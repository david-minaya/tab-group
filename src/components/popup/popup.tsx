import * as React from 'react';
import * as style from './popup.css';
import { Option } from '../option';

export function Popup() {

  function handleOpenPageButtonClick() {
    window.open(chrome.runtime.getURL('tab-bar-page.html'));
  }

  return (
    <div className={style.popup}>
      <div className={style.title}>Grupo de pestañas</div>
      <div className={style.options}>
        <Option 
          icon="addin" 
          title="Abrir barra de pestañas"/>
        <Option 
          icon="openinnewtab" 
          title="Abrir la página Grupo de pestañas" 
          onClick={handleOpenPageButtonClick}/>
      </div>
    </div>
  );
}
