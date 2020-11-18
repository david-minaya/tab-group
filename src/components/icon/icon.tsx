import * as React from 'react';
import * as style from './icon.css';

interface props {
  className?: string;
  icon: string;
  tag?: string;
  onClick?: () => void;
}

export function Icon({ className, icon, tag, onClick }: props) {
  return (
    <div 
      className={className || style.icon}
      data-tag={tag}
      onClick={onClick}>
      {icon}
    </div>
  );
}
