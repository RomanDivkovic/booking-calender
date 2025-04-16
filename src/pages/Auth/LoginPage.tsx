import Typography from '../../components/Typography/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db } from '../../../firebase';
import TextField from '../../components/Textfield/Textfield';
import Button from '../../components/Button/Button';
import styles from './LoginPage.module.scss';
import CustomAlert from '../../components/Alert/Alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const createProfileIfNotExists = async (user: any) => {
    const profileRef = ref(db, `profiles/${user.uid}`);
    const snapshot = await get(profileRef);
    if (!snapshot.exists()) {
      await set(profileRef, {
        display_name: user.displayName || user.email,
        color: getRandomColor()
      });
    }
  };

  const handleSignIn = async () => {
    setEmailError('');
    setPasswordError('');
    setError('');

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await createProfileIfNotExists(userCred.user);
      navigate('/');
    } catch (err: any) {
      console.error(err.message);
      setError('Fel vid inloggning');
      if (err.message.toLowerCase().includes('email')) {
        setEmailError('Felaktig e-postadress');
      } else if (err.message.toLowerCase().includes('password')) {
        setPasswordError('Felaktigt lösenord');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createProfileIfNotExists(result.user);
      setShowAlert(true);
    } catch (err: any) {
      setError(err.message || 'Kunde inte logga in med Google');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['content-container']}>
        <Typography margin={{ t: 20, b: 40 }} align="center" variant="h1">
          Logga in
        </Typography>

        {error && (
          <Typography align="center" variant="label-error">
            {error}
          </Typography>
        )}

        <div className={styles.textfield}>
          <TextField
            label="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isError={!!emailError}
            errorMessage={emailError}
          />
          <TextField
            label="Lösenord"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isError={!!passwordError}
            errorMessage={passwordError}
          />
        </div>

        <div className={styles['button-container']}>
          <Button variant="primary" onClick={handleSignIn}>
            Logga in
          </Button>
          <Button
            variant="text"
            iconLeft="google"
            iconSize="xl"
            onClick={handleGoogleLogin}
            childMargin={{ l: 5 }}
          >
            Google
          </Button>
          <Button variant="secondary" onClick={() => navigate('/registration')}>
            Registrera
          </Button>
        </div>

        <CustomAlert
          visible={showAlert}
          onClose={() => {
            setShowAlert(false);
            navigate('/');
          }}
          title="Inloggning lyckades"
          body="Du är nu inloggad med Google."
          buttons={[{ text: 'Okej', onPress: () => {} }]}
        />
      </div>
    </div>
  );
}
