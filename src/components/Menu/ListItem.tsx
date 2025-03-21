import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.scss';

interface ListItemsProps {
  display: string;
  to: string;
  icon: string;
  iconSize: string;
  badgeCount?: number;
}

const ListItems: React.FC<ListItemsProps> = ({
  display,
  to,
  icon,
  iconSize,
  badgeCount
}) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(to);
  };

  return (
    <div className={styles['list-item']} onClick={handleItemClick}>
      <div className={styles.circle}>
        <i className={`icon-${icon} icon-${iconSize}`}></i>
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className={styles.badge}>{badgeCount}</span>
        )}
      </div>
      <div className={styles.text}>{display}</div>
    </div>
  );
};

export default ListItems;
