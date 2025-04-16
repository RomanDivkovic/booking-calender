import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { Logo } from '../Logo/Logo';
import LinkTo from '../LinkTo/LinkTo';
import { useDeviceSize } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import { getAuth } from 'firebase/auth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useDeviceSize();

  const [signedIn, setSignedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
        setDisplayName(user.displayName || user.email?.split('@')[0] || 'User');
      } else {
        setSignedIn(false);
        setDisplayName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Logo
            onClick={signedIn ? () => navigate('/') : undefined}
            color="cleanNewLogo"
            size={isMobile ? 'xs' : 'sm'}
          />
          {signedIn && displayName && (
            <LinkTo margin={{ l: '30px' }} to={'/profile'} animation>
              {displayName}
            </LinkTo>
          )}
        </div>
        <div className={styles.right}>
          {signedIn && (
            <>
              <Button
                tiny
                onClick={() => navigate('/calendar')}
                variant="primary"
              >
                📅
              </Button>
            </>
          )}
        </div>
      </nav>
      {/* Menu-komponent kan aktiveras igen senare */}
    </header>
  );
};

export default Header;
