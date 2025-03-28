// src/components/Button/GoogleButton.tsx
import { useEffect, useState } from 'react';
import styles from './GoogleButton.module.scss';
import googleIcon from '../../assets/icons/web_neutral_rd_SI.svg';
import googleIconMobile from '../../assets/icons/web_neutral_rd_na.svg';
import { supabase } from '../../lib/supabase';
import { useDeviceSize } from '../../utils/functions';

interface GoogleButtonProps {
  onError?: (message: string) => void;
}

export default function GoogleButton({ onError }: GoogleButtonProps) {
  const { isMobile } = useDeviceSize();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error && onError) {
      onError(error.message);
    }
  };

  return isMobile ? (
    <button className={styles.googleIconButton} onClick={handleGoogleLogin}>
      <img src={googleIconMobile} alt="Google icon" />
    </button>
  ) : (
    <button className={styles.googleButton} onClick={handleGoogleLogin}>
      <img src={googleIcon} alt="Google icon" />
    </button>
  );
}
