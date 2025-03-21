import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { LoadingScreen } from '../pages/LoadingScreen/LoadingScreen';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
