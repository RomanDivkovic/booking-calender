import Typography from '../../components/Typography/Typography';
import { FormEvent, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button/Button';
import TextField from '../../components/Textfield/Textfield';
import styles from './LoginPage.module.scss';
import LinkTo from '../../components/LinkTo/LinkTo';
import { Icon } from '../../components/Icon/Icon';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');

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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['content-container']}>
        <div>
          <LinkTo to="/" animation>
            <Icon
              color="primary"
              name="arrow-right"
              size="md"
              margin={{ r: 4 }}
              flipIconDirection={true}
            />
            Back
          </LinkTo>
        </div>
        <Typography variant="h1">Registrering</Typography>
        <>
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
              label="Lösenord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isError={!!passwordError}
              errorMessage={passwordError}
            />
            <TextField
              label="Lösenord"
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
          {/* {success && <Typography variant="label-success">{success}</Typography>} */}
        </>
      </div>
    </div>
  );
};
