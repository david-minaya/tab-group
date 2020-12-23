import * as React from 'react';
import style from './menu.css'; 

interface Props {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  updateMenuPosition?: (menu: HTMLDivElement) => void;
  onCloseMenu: () => void;
}

export function Menu(props: Props) {

  const { 
    className = style.menu, 
    isOpen, 
    children, 
    updateMenuPosition, 
    onCloseMenu 
  } = props;

  const menuRef = React.useRef<HTMLDivElement>();
  const handleWindowClick = React.useCallback(() => onCloseMenu(), []);

  React.useEffect(() => {

    const menuElement = menuRef.current;

    if (isOpen) {
    
      menuElement.style.display = 'block';
      updatePosition();
      menuElement.style.visibility = 'visible';

      window.addEventListener('click', handleWindowClick);
      window.addEventListener('resize', updatePosition);

    } else {

      menuElement.style.display = 'none';
      menuElement.style.visibility = 'hidden';
    
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  function updatePosition() {
    if (updateMenuPosition) {
      updateMenuPosition(menuRef.current);
    }
  }

  return (
    <div 
      className={className} 
      ref={menuRef} 
      onClick={e => e.stopPropagation()}>
      {children}
    </div>
  );
}
