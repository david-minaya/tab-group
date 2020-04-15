import * as React from 'react';
import * as style from './button.css';

interface props {
  className: any;
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
