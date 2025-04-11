import { SetStateAction, useState } from 'react';
import TextField from '../../components/Textfield/Textfield';
import Button from '../../components/Button/Button';
import { signIn } from './auth';
import Typography from '../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const createProfileIfNotExists = async (user: any) => {
    const { id, user_metadata, email } = user;
    console.log('Checking profile for user:', id);

    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.warn('Error checking profile:', fetchError.message);
    }

    if (!existingProfile) {
      const getRandomColor = (): string => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      const insertResult = await supabase.from('profiles').insert({
        id,
        display_name:
          user_metadata?.full_name || user_metadata?.name || email || 'User',
        color: getRandomColor()
      });

      console.log('Inserted profile result:', insertResult);
    }
  };

  const handleSignIn = async () => {
    try {
      setEmailError('');
      setPasswordError('');
      await signIn(email, password);
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) await createProfileIfNotExists(user);
    } catch (error: any) {
      setError(error.message);
      if (error.message.toLowerCase().includes('email')) {
        setEmailError('Felaktig e-postadress');
      } else if (error.message.toLowerCase().includes('password')) {
        setPasswordError('Felaktigt lösenord');
      }
    }
  };

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setError(error.message);
      return;
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await createProfileIfNotExists(session.user);
      }
    });
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
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setEmail(e.target.value)
            }
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
            childMargin={{ l: 5 }}
            iconSize="xl"
            onClick={googleLogin}
            iconLeft="google"
            variant={'text'}
          >
            google
          </Button>
          <Button variant="secondary" onClick={() => navigate('/registration')}>
            Registrera
          </Button>
        </div>
      </div>
    </div>
  );
}
