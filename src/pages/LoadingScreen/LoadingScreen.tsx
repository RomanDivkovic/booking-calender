import scss from './LoadingScreen.module.scss';
import Typography from '../../components/Typography/Typography';
import Loader from '../../components/Loader/Loader';
import { useDeviceSize } from '../../utils/functions';

type Props = {
  text?: string;
  standalone?: boolean;
};

export const LoadingScreen = ({ text, standalone: embedded }: Props) => {
  const { isMobile } = useDeviceSize();
  return (
    <div className={scss.box}>
      <div className={scss.container}>
        <Loader
          height={'20px'}
          width={'20px'}
          margin={{ t: '20px' }}
          animationType={'loading'}
          show
          loop
        />
        <Typography align="center" variant="h2">
          {text}
        </Typography>
      </div>
    </div>
  );
};
