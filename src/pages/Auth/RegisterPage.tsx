import { FormEvent, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../../../firebase';

import Typography from '../../components/Typography/Typography';
import Button from '../../components/Button/Button';
import TextField from '../../components/Textfield/Textfield';
import CustomAlert from '../../components/Alert/Alert';
import LinkTo from '../../components/LinkTo/LinkTo';
import { Icon } from '../../components/Icon/Icon';

import styles from './Register.module.scss';
import { useNavigate } from 'react-router-dom';

const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    setRepeatPasswordError('');

    if (!email.includes('@')) {
      setEmailError('Ange en giltig e-postadress.');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Lösenordet måste vara minst 6 tecken.');
      return;
    }

    if (password !== repeatPassword) {
      setRepeatPasswordError('Lösenorden matchar inte.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      await updateProfile(user, { displayName });

      const profileRef = ref(db, `profiles/${user.uid}`);
      const snapshot = await get(profileRef);

      if (!snapshot.exists()) {
        await set(profileRef, {
          display_name: displayName || email,
          color: getRandomColor()
        });
      }

      setShowAlert(true);
    } catch (err: any) {
      console.error('Registreringsfel:', err.message);
      setError(err.message || 'Ett fel uppstod');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['text-box']}>
        <LinkTo to="/" animation>
          <Icon
            color="primary"
            name="arrow-right"
            size="md"
            margin={{ r: 4, b: 3 }}
            flipIconDirection={true}
          />
          Back
        </LinkTo>

        <Typography align="center" margin={{ b: 3 }} variant="h1">
          Registrering
        </Typography>

        <form className={styles.form} onSubmit={handleRegister}>
          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isError={!!emailError}
            errorMessage={emailError}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isError={!!passwordError}
            errorMessage={passwordError}
          />
          <TextField
            label="Repeat password"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            isError={!!repeatPasswordError}
            errorMessage={repeatPasswordError}
          />
          <Button type="submit" variant="primary">
            Registrera
          </Button>
        </form>

        {error && <Typography variant="label-error">{error}</Typography>}

        <CustomAlert
          visible={showAlert}
          onClose={() => {
            setShowAlert(false);
            navigate('/');
          }}
          title="Konto skapat!"
          body="Du kan nu logga in med din e-post."
          buttons={[
            {
              text: 'Okej',
              onPress: () => {}
            }
          ]}
        />
      </div>
    </div>
  );
};
