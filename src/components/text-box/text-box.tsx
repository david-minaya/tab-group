import * as React from 'react';
import * as style from './text-box.css';

interface props {
  className?: string;
  placeholder: string;
  value: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

export function TextBox({ className = style.textBox, placeholder, value, onChange }: props) {
  return (
    <input 
      className={className}
      type='text' 
      placeholder={placeholder}
      value={value} 
      onChange={onChange}/>
  );
}
