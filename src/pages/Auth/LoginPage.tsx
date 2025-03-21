import { SetStateAction, useState } from 'react';
import TextField from '../../components/Textfield/Textfield';
import Button from '../../components/Button/Button';
import { signIn, signUp } from './auth';
import Typography from '../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      alert('Inloggning lyckades!');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const googleLogin = async () => {
    console.log('test');
  };

  return (
    <div>
      <Typography variant="h1">Logga in</Typography>
      <div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <TextField
          label="E-post"
          value={email}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setEmail(e.target.value)
          }
        />
        <TextField
          label="Lösenord"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="primary" onClick={handleSignIn}>
          Logga in
        </Button>
        <Button variant="secondary" onClick={googleLogin}>
          Google
        </Button>
        <Button variant="secondary" onClick={() => navigate('/registration')}>
          Registrera
        </Button>
      </div>
    </div>
  );
}
