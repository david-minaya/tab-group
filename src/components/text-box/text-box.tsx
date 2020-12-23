import * as React from 'react';
import style from './text-box.css';

interface props {
  className?: string;
  placeholder: string;
  value: string;
  autofocus?: boolean;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onEnterPress?: () => void;
}

export function TextBox({ 
  className = style.textBox, 
  placeholder, 
  value, 
  autofocus = false,
  onChange, 
  onEnterPress 
}: props) {


  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === 13) {
      onEnterPress();
    }
  }

  return (
    <input 
      className={className}
      type='text' 
      placeholder={placeholder}
      value={value} 
      autoFocus={autofocus}
      onChange={onChange}
      onKeyDown={handleKeyDown}
    />
  );
}
