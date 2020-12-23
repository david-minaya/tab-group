import * as React from 'react';
import style from './button.css';

interface props {
  className: string;
  text: string;
  onClick?: (event: React.FormEvent<HTMLButtonElement>) => void;
}

export function Button({ text, className = style.button, onClick }: props) {
  return (
    <button 
      className={className}
      onClick={onClick}>
      {text}
    </button>
  );
}
