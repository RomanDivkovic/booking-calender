import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // Se till att detta är rätt path
import Button from '../../components/Button/Button';

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // Skickar användaren tillbaka till login-sidan
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Min Profil</h1>
      <p>Här kan du se och redigera din information 👤</p>

      <Button onClick={handleLogout} variant="primary">
        Logga ut
      </Button>
    </div>
  );
}
