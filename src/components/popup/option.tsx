import * as React from 'react';
import { Icon } from 'office-ui-fabric-react';
import '../../styles/popup/option.css';

interface props {
  icon: string,
  title: string,
  onClick?: () => void
}

export function Option({ icon, title, onClick }: props) {
  return (
    <div className='option' onClick={onClick}>
      <Icon className='icon' iconName={icon}/>
      <div className='name'>{title}</div>
    </div>
  );
}
