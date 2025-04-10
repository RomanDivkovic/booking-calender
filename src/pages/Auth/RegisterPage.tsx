import Typography from '../../components/Typography/Typography';
import { FormEvent, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button/Button';
import styles from './LoginPage.module.scss';
import LinkTo from '../../components/LinkTo/LinkTo';
import { Icon } from '../../components/Icon/Icon';
import TextField from '../../components/Textfield/Textfield';
import CustomAlert from '../../components/Alert/Alert';
import { useNavigate } from 'react-router-dom'; // ✅ Glömd import

const createProfileIfNotExists = async (user: any, displayName?: string) => {
  const { id, user_metadata, email } = user;

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingProfile) {
    const getRandomColor = (): string => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    await supabase.from('profiles').insert({
      id,
      display_name:
        displayName ||
        user_metadata?.full_name ||
        user_metadata?.name ||
        email ||
        'User',
      color: getRandomColor()
    });
  }
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
  const navigate = useNavigate(); // ✅

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
        data: { displayName }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      if (data.user) {
        await createProfileIfNotExists(data.user, displayName);
        setShowAlert(true); // ✅ Visa alert när konto skapas
      }
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
              margin={{ r: 4, b: 3 }}
              flipIconDirection={true}
            />
            Back
          </LinkTo>
        </div>
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
            label="Lösenord"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isError={!!passwordError}
            errorMessage={passwordError}
          />
          <TextField
            label="Upprepa lösenord"
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
            navigate('/login'); // ✅ Navigera vidare efter alert stängs
          }}
          title="Konto skapat!"
          body="Verifiera din e-post innan du loggar in."
          buttons={[
            {
              text: 'Okej',
              onPress: () => {
                // valfri logik
              }
            }
          ]}
        />
      </div>
    </div>
  );
};
