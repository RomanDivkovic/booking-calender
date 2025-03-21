import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { Logo } from '../Logo/Logo';
import LinkTo from '../LinkTo/LinkTo';
import { useDeviceSize } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import { Menu } from '../Menu/Menu';
import { Icon } from '../Icon/Icon';
import Button from '../Button/Button';
import Section from '../Menu/Section';
import { supabase } from '../../lib/supabase'; // 👈 Glöm inte importera!

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useDeviceSize();

  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const HandleButtonClick = () => {
    supabase.auth.signOut();
    window.location.pathname = '/login';
  };

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
                onClick={() => navigate('/calender')}
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
