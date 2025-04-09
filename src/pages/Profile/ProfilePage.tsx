import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button/Button';
import styles from './ProfilPage.module.scss';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const fallbackDisplayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.display_name ||
          user.email?.split('@')[0] ||
          'User';
        setDisplayName(fallbackDisplayName);

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('color')
          .eq('id', user.id)
          .limit(1);

        const profile = profiles?.[0];

        console.log('Profile data:', profile, 'Error:', error);

        if (profile?.color) {
          setColor(profile.color);
        } else {
          console.log('Profile not found or color is null – creating one.');

          const getRandomColor = (): string => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          };

          const color = getRandomColor();

          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              display_name: fallbackDisplayName,
              color
            });

          if (!insertError) {
            setColor(color);
          } else {
            console.warn('Error creating profile:', insertError.message);
          }
        }
      }
    };

    getUserInfo();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Är du säker på att du vill ta bort ditt konto och all data? Detta går inte att ångra.'
    );
    if (!confirmed) return;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    try {
      await supabase.from('bookings').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      // Note: This requires service_role key, only works server-side
      await supabase.auth.admin.deleteUser(user.id);

      alert('Ditt konto har tagits bort.');
      navigate('/login');
    } catch (err) {
      console.error('Fel vid borttagning av konto:', err);
      alert('Kunde inte ta bort kontot. Försök igen.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['content-container']}>
        <h1 className="text-2xl font-bold">Hej {displayName}!</h1>
        <p>Här kan du se och redigera din information 👤</p>
        <p>
          Din kalenderfärg:{' '}
          <span
            style={{
              backgroundColor: color,
              padding: '4px 12px',
              color: '#fff',
              borderRadius: '6px',
              marginLeft: '8px'
            }}
          >
            {color}
          </span>
        </p>

        <div className={styles['button-container']}>
          <Button onClick={handleLogout} variant="primary">
            sign out
          </Button>
          <Button
            margin={{ t: 20 }}
            onClick={handleDeleteAccount}
            variant="danger"
          >
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}
