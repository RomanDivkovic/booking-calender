import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  signOut,
  deleteUser,
  onAuthStateChanged
} from 'firebase/auth';
import { getDatabase, ref, get, set, remove } from 'firebase/database';
import Button from '../../components/Button/Button';
import styles from './ProfilPage.module.scss';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [color, setColor] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const fallbackName =
          user.displayName || user.email?.split('@')[0] || 'User';
        setDisplayName(fallbackName);

        const profileRef = ref(db, `profiles/${user.uid}`);
        const snapshot = await get(profileRef);

        if (snapshot.exists()) {
          const profile = snapshot.val();
          if (profile.color) {
            setColor(profile.color);
          }
        } else {
          const getRandomColor = (): string => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          };

          const newColor = getRandomColor();
          await set(profileRef, {
            displayName: fallbackName,
            color: newColor
          });
          setColor(newColor);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Är du säker på att du vill ta bort ditt konto och all data? Detta går inte att ångra.'
    );
    if (!confirmed || !auth.currentUser || !userId) return;

    try {
      // Ta bort från realtime database
      await remove(ref(db, `bookings/${userId}`));
      await remove(ref(db, `profiles/${userId}`));

      // Ta bort själva kontot
      await deleteUser(auth.currentUser);

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
            Sign out
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
