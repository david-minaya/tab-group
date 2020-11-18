import * as React from 'react';
import * as style from './icon-option.css';
import { Icon } from '../icon';

interface props {
  className?: string;
  iconName: string;
  onClick: () => void;
}

export function IconOption({ className, iconName, onClick }: props) {
  return (
    <Icon
      className={className || style.iconOption}
      icon={iconName}
      tag='icon-option'
      onClick={onClick} />
  );
}
