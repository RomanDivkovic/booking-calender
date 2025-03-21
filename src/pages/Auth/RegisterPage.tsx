import Typography from '../../components/Typography/Typography';
import { FormEvent, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import TextField from '../../components/Textfield/Textfield';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
    } else {
      setSuccess(
        'Registrering lyckades! Kontrollera din e-post för bekräftelse.'
      );
    }
  };

  return (
    <div>
      <Typography variant="h1">Registrering</Typography>
      <form onSubmit={handleRegister}>
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
        />
        <TextField
          label="Lösenord"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Registrera</Button>
      </form>
      {error && <Typography variant="label-error">{error}</Typography>}
      {/* {success && <Typography variant="label-success">{success}</Typography>} */}
    </div>
  );
};
