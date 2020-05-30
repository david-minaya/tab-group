import * as React from 'react';
import * as style from './save-modal.css';
import { Button } from '../button';
import { TextBox } from '../text-box';
import { Storage, LocalStorage, TabGroup } from '../../storage';

const storage = new Storage(new LocalStorage());

interface props {
  isOpen: boolean;
  tabGroup: TabGroup;
  onCloseModal?: () => void;
}

export function SaveModal({ isOpen = false, tabGroup, onCloseModal }: props) {

  const [name, setName] = React.useState('');
  const [isValidName, setIsValidName] = React.useState(true);

  React.useEffect(() => {
    window.onclick = () => onCloseModal();
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setName('');
      setIsValidName(true);
    }
  });

  function handleTextBoxChange(event: React.FormEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  async function handleSaveTabBar() {

    // Isn't empty or white space
    const isValidName = /\S+/.test(name);
    
    if (isValidName) {
      tabGroup.name = name;
      tabGroup.isTemp = false;
      await storage.updateTabGroup(tabGroup);
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
