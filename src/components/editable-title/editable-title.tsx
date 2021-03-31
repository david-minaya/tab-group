import * as React from 'react';
import defaultStyle from './editable-title.css';
import { useStyle } from '../../hooks';
import { TextBox } from '../text-box';

interface Style {
  title?: string;
  editableTitle?: string;
}

interface Props {
  style?: Style,
  title: string;
  isEditable: boolean;
  onTitleChange: (title: string) => void;
  onDisableTitle: () => void;
}

export function EditableTitle(props: Props) {

  const {
    style: overriddenStyle,
    title: defaultTitle,
    isEditable,
    onTitleChange,
    onDisableTitle
  } = props;

  const style = useStyle<Style>(defaultStyle, overriddenStyle);
  const [title, setTitle] = React.useState('');
  const [selectText, setSelectText] = React.useState(false);

  React.useEffect(() => setTitle(defaultTitle), [defaultTitle]);
  React.useEffect(() => setSelectText(isEditable), [isEditable]);

  const handleClick = (e: any) => e.stopPropagation();
  const handleChange = (e: any) => setTitle(e.currentTarget.value);
  const handleBlur = () => discardChanges();

  async function handleTextBoxKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'Enter':
        changeTitle();
        break;
      case 'Escape':
        discardChanges();
        break;
    }
  }

  function changeTitle() {
    if (title.trim() === '') return discardChanges();
    onTitleChange(title);
  }

  function discardChanges() {
    setTitle(defaultTitle);
    setSelectText(false);
    onDisableTitle();
  }
  
  return (
    <TextBox 
      style={isEditable ? style.editableTitle : style.title} 
      value={title}
      title={!isEditable && title}
      disabled={!isEditable} 
      selectedText={selectText}
      onKeyDown={handleTextBoxKeyDown}
      onClick={handleClick}
      onChange={handleChange}
      onBlur={handleBlur}/>
  );
}
