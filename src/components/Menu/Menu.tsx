import { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Menu.module.scss';
import { Icon, IconSizes } from '../Icon/Icon';
import Button from '../Button/Button';

type MenuItem = {
  display: string;
  to: string;
  icon: string;
  iconSize?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  menuItems?: MenuItem[];
  onSignOut: () => void;
};

export const Menu = ({
  isOpen,
  onClose,
  menuItems,
  onSignOut,
  children
}: Props) => {
  const navigate = useNavigate();
  const menuElement = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (navigated) {
      closeMenu();
      setNavigated(false);
    }
  }, [navigated]);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      menuElement.current &&
      !menuElement.current.contains(event.target as Node)
    ) {
      closeMenu();
    }
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleMenuItemClick = (to: string) => {
    navigate(to);
    setNavigated(true); // Sätt navigeringsstatus
  };

  const handleSignOutClick = () => {
    onSignOut();
    closeMenu();
  };

  const menuClasses = classNames({
    [styles.menu]: true,
    [styles['slide-in']]: isOpen && !isClosing,
    [styles['slide-out']]: !isOpen || isClosing
    //  [styles.desktop]: !isMobile,
    // [styles.mobile]: isMobile
  });

  return (
    <div ref={menuElement} className={menuClasses}>
      <div className={styles.header}>
        <button onClick={closeMenu} className={styles['close-button']}>
          <Icon color="primary" size="lg" name="close" />
        </button>
      </div>
      <div className={styles.padding}>
        {menuItems?.map((item, index) => (
          <div
            key={index}
            className={styles['menu-item']}
            onClick={() => handleMenuItemClick(item.to)}
          >
            <Icon
              name={item.icon}
              size={(item.iconSize as IconSizes) || 'md'}
            />
            <span>{item.display}</span>
          </div>
        ))}
        {children}
        <Button
          variant="secondary"
          margin={{ t: '10px' }}
          onClick={handleSignOutClick}
        >
          Logga ut
        </Button>
      </div>
    </div>
  );
};
