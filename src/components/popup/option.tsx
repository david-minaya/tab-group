import * as React from 'react';
import * as style from '../../styles/popup/option.css';
import { Icon } from 'office-ui-fabric-react';

interface props {
  icon: string,
  title: string,
  onClick?: () => void
}

export function Option({ icon, title, onClick }: props) {
  return (
    <div className={style.option} onClick={onClick}>
      <Icon className={style.icon} iconName={icon}/>
      <div className={style.name}>{title}</div>
    </div>
  );
}
