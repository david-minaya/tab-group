import * as React from 'react';
import style from './icon.css';

interface props {
  className?: string;
  icon: string;
  tag?: string;
  isVisible?: boolean;
  onClick?: (event?: any) => void;
}

export function Icon({ className, icon, tag, isVisible = true, onClick }: props) {
  return (
    <div 
      className={className || style.icon}
      data-tag={tag}
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      onClick={onClick}>
      {icon}
    </div>
  );
}
