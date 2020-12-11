import * as React from 'react';
import * as style from './save-modal.css';
import { Storage, LocalStorage } from '../../storage';
import { TabGroup } from '../../models';
import { STORAGE_NAME } from '../../constants';
import { Button, TextBox } from '../';

interface props {
  isOpen: boolean;
  tabGroup: TabGroup;
  onCloseModal?: () => void;
}

export function SaveModal({ isOpen = false, tabGroup, onCloseModal }: props) {
  
  const storage = React.useMemo(() => Storage.init(LocalStorage, STORAGE_NAME), []); 
  const handleWindowClick = React.useCallback(() => onCloseModal(), []);

  const [name, setName] = React.useState('');
  const [isValidName, setIsValidName] = React.useState(true);

  React.useEffect(() => {

    if (isOpen) {
    
      window.addEventListener('click', handleWindowClick);

    } else {

      setName('');
      setIsValidName(true);
      window.removeEventListener('click', handleWindowClick);
    }
  }, [isOpen]);

  function handleTextBoxChange(event: React.FormEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  async function handleSaveTabBar() {

    // Isn't empty or white space
    const isValidName = /\S+/.test(name);
    
    if (isValidName) {
      tabGroup.name = name;
      tabGroup.isTemp = false;
      await storage.tabsGroups.updateTabGroup(tabGroup);
      onCloseModal();
    } 

    setIsValidName(isValidName);
  }

  if (!isOpen) return null;

  return (
    <div className={style.saveModal} onClick={ e => e.stopPropagation() }>
      <div className={style.title}>Guardar barra de pestañas</div>
      <div className={style.content}>
        <TextBox
          className={style.textBox}
          placeholder='Nombre'
          value={name}
          autofocus={true}
          onChange={handleTextBoxChange} 
          onEnterPress={handleSaveTabBar}/>
        { !isValidName &&
          <div className={style.invalidName}>
            Nombre invalido*
          </div>
        }
        <div className={style.buttons}>
          <Button
            className={style.cancelButton}
            text='Cancelar'
            onClick={onCloseModal} />
          <Button
            className={style.saveButton}
            text='Guardar'
            onClick={handleSaveTabBar} />
        </div>
      </div>
    </div>
  );
}
