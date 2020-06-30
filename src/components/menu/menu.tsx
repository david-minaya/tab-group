import * as React from 'react';
import * as style from './menu.css'; 

interface props {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  calculateMenuPosition?: (menu: HTMLDivElement, parentRect: DOMRect) => void;
  onCloseMenu: () => void;
}

export function Menu({ className = style.menu, isOpen, children, calculateMenuPosition, onCloseMenu }: props) {

  const menuRef = React.useRef<HTMLDivElement>();
  const handleWindowClick = React.useCallback(() => onCloseMenu(), []);

  React.useEffect(() => {

    const menuElement = menuRef.current;

    if (isOpen) {
    
      menuElement.style.display = 'block';
      updateMenuPosition();
      menuElement.style.visibility = 'visible';

      window.addEventListener('click', handleWindowClick);
      window.addEventListener('resize', updateMenuPosition);

    } else {

      menuElement.style.display = 'none';
      menuElement.style.visibility = 'hidden';
    
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', updateMenuPosition);
    }

    return () => {
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', updateMenuPosition);
    };
  }, [isOpen]);

  function updateMenuPosition() {

    const menuElement = menuRef.current;
    const parentElement = menuElement.parentElement;    
    const parentRect = parentElement.getBoundingClientRect();
    
    if (calculateMenuPosition) {
      calculateMenuPosition(menuElement, parentRect);
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
};
