import React, { useState } from 'react';
import { marginToCssProp, rem } from '../../utils/functions';
import green_logo from '../../assets/icons/greenbettingfriends.svg';
import newLogo from '../../assets/Logo/GOLDLOGO-removebg-preview.png';
import newTest from '../../assets/Logo/77banner-removebg-preview.png';
import cleanNewLogo from '../../assets/Logo/final_circular_transparent_icon.webp';

const logo = {
  green_logo,
  newLogo,
  newTest,
  cleanNewLogo
};

type Margin =
  | { t?: number | string }
  | { b?: number | string }
  | { l?: number | string }
  | { r?: number | string }
  | { h?: number | string }
  | { v?: number | string }
  | undefined;

const sizes = {
  xs: rem('50px'),
  sm: rem('75px'),
  md: rem('150px'),
  lg: rem('200px'),
  xl: rem('280px')
};

type Props = {
  size?: keyof typeof sizes;
  style?: React.CSSProperties;
  color?: keyof typeof logo;
  margin?: Margin;
  onClick?: (event: React.MouseEvent) => void;
};

export const Logo = ({
  size = 'md',
  style = {},
  color = 'newTest',
  margin,
  onClick
}: Props) => {
  const [isClicked, setIsClicked] = useState(false);
  const marginStyles = marginToCssProp(margin);

  const handleClick = (event: React.MouseEvent) => {
    setIsClicked(true);
    if (onClick) {
      onClick(event);
    }
    setTimeout(() => setIsClicked(false), 200); // Reset click state after 200ms
  };

  return (
    <img
      onClick={handleClick}
      src={logo[color]}
      alt="Btf logo"
      data-e2e="btf_logo"
      style={{
        ...style,
        margin: marginStyles,
        height: sizes[size],
        cursor: onClick ? 'pointer' : 'default',
        transform: isClicked ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.2s'
      }}
    />
  );
};
