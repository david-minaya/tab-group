import * as React from 'react';
import * as style from './option.css';
import { Icon } from 'office-ui-fabric-react';

interface props {
  icon?: string;
  title: string;
  tag?: string;
  className?: string;
  onClick?: (tag: string) => void;
}

export function Option({ icon, title, tag, className = style.option, onClick }: props) {

  function handleClick() {
    onClick(tag);
  }

  return (
    <div className={className} onClick={handleClick}>
      <Icon className={style.icon} iconName={icon}/>
      <div className={style.name}>{title}</div>
    </div>
  );
}