import * as React from 'react';
import defaultStyle from './text-box.css';

interface Props {
  style?: string;
  value: string;
  title?: string;
  disabled?: boolean;
  selectedText?: boolean;
  placeholder?: string;
  autofocus?: boolean;
  onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export function TextBox(props: Props) {

  const { 
    style = defaultStyle.textBox, 
    value, 
    title,
    disabled,
    selectedText = false,
    placeholder, 
    autofocus = false,
    onClick,
    onChange, 
    onKeyDown,
    onBlur
  } = props;

  const textBoxRef = React.useRef<HTMLInputElement>();

  React.useEffect(() => {
    if (selectedText) {
      textBoxRef.current.select();
      textBoxRef.current.focus();
    } else {
      textBoxRef.current.value = '';
      textBoxRef.current.value = value;
    }
  }, [selectedText]);

  return (
    <input 
      className={style}
      type='text' 
      value={value} 
      title={title}
      disabled={disabled}
      placeholder={placeholder}
      autoFocus={autofocus}
      ref={textBoxRef}
      onClick={onClick}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}/>
  );
}
