import * as React from 'react';
import style from './icon-option.css';
import { Icon } from '../icon';

interface props {
  className?: string;
  iconName: string;
  isVisible?: boolean
  onClick: (event: any) => void;
}

export function IconOption({ className, iconName, isVisible, onClick }: props) {
  return (
    <Icon
      className={className || style.iconOption}
      icon={iconName}
      tag='icon-option'
      isVisible={isVisible}
      onClick={onClick} />
  );
}
