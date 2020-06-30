import * as React from 'react';
import * as style from './icon-option.css';
import { Icon } from 'office-ui-fabric-react';

interface props {
  className?: string;
  iconName: string;
  onClick: () => void;
}

export function IconOption({ className, iconName, onClick }: props) {
  return (
    <Icon
      className={className || style.iconOption}
      iconName={iconName}
      data-tag='icon-option'
      onClick={onClick} />
  );
}
