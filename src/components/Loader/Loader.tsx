import React from 'react';
import Lottie from 'lottie-react';
import scss from './Loader.module.scss';
import loader from '../../assets/animation/load.json';
import four from '../../assets/animation/4-loading.json';
import loading from '../../assets/animation/loading.json';
import react from '../../assets/animation/react-animation.json';
import { FixMeLater } from '../../types';
import { marginToCssProp } from '../../utils/functions';

type LoaderProps = {
  show: boolean;
  height?: number | string;
  width?: number | string;
  loop?: boolean;
  margin?: FixMeLater;
  animationType?: 'four' | 'loader' | 'loading' | 'react';
};

const Loader: React.FC<LoaderProps> = ({
  show,
  width,
  height,
  margin,
  animationType = 'react'
}) => {
  const renderAnimation = () => {
    let animationData;
    switch (animationType) {
      case 'loader':
        animationData = loader;
        break;
      case 'four':
        animationData = four;
        break;
      case 'loading':
        animationData = loading;
        break;
      case 'react':
        animationData = react;
        break;
      default:
        animationData = four;
    }

    return (
      <Lottie
        animationData={animationData}
        height={marginToCssProp(height)}
        width={marginToCssProp(width)}
      />
    );
  };

  return show ? (
    <div className={scss.heart} style={{ margin: marginToCssProp(margin) }}>
      {renderAnimation()}
    </div>
  ) : null;
};

export default Loader;
