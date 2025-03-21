import React, { useEffect, useState, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../Modal/Modal';
import Typography from '../Typography/Typography';
import { AuthContext } from '../../Context/AuthContext';
import { LoadingScreen } from '../../views/LoadingScreen/LoadingScreen';

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = ({ children }: IAuthRouteProps) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { isLoggingOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        if (!isLoggingOut) {
          setModalVisible(true);
        }
        setLoading(false);
      }
    });

    return () => AuthCheck();
  }, [auth, navigate, isLoggingOut]);

  if (loading) return <LoadingScreen />;

  const NavigateBack = () => {
    setModalVisible(false);
    navigate('/login');
  };

  return (
    <>
      {children}
      {!isLoggingOut && (
        <Modal
          isOpen={modalVisible}
          text={
            <div>
              <Typography variant="p">
                You are not authorized to access this page.
              </Typography>
            </div>
          }
          title="Unauthorized"
          handleClose={() => NavigateBack()}
          iconName={'info'}
          closeButton={{
            variant: 'primary',
            text: 'Close'
          }}
        />
      )}
    </>
  );
};

export default AuthRoute;
