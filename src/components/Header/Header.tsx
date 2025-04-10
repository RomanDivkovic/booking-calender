import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { Logo } from '../Logo/Logo';
import LinkTo from '../LinkTo/LinkTo';
import { useDeviceSize } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import { supabase } from '../../lib/supabase';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useDeviceSize();

  const [signedIn, setSignedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        setSignedIn(true);
        setDisplayName(
          user.user_metadata?.full_name ||
            user.user_metadata?.display_name ||
            user.email?.split('@')[0] ||
            'User'
        );
      } else {
        setSignedIn(false);
      }
    };

    getUserInfo();
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
