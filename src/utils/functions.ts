import { FixMeLater } from '../types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';

export const isWebUrl = (str: string): boolean => {
  const urlPattern = new RegExp('(^http[s]?:\\/{2})|(^www)|(^\\/{2})');
  return urlPattern.test(str);
};

type Margin =
  | number
  | string
  | undefined
  | {
      t?: number | string;
      r?: number | string;
      b?: number | string;
      l?: number | string;
      v?: number | string;
      h?: number | string;
    };

export const marginToCssProp = (value: Margin): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const marginObj =
    typeof value === 'object'
      ? value
      : {
          t: value,
          r: value,
          b: value,
          l: value
        };

  return (
    `${
      rem(marginObj.t?.toString() ?? '0') ||
      rem(marginObj.v?.toString() ?? '0') ||
      '0px'
    } ` +
    `${
      rem(marginObj.r?.toString() ?? '0') ||
      rem(marginObj.h?.toString() ?? '0') ||
      '0px'
    } ` +
    `${
      rem(marginObj.b?.toString() ?? '0') ||
      rem(marginObj.v?.toString() ?? '0') ||
      '0px'
    } ` +
    `${
      rem(marginObj.l?.toString() ?? '0') ||
      rem(marginObj.h?.toString() ?? '0') ||
      '0px'
    }`
  );
};

export const paddingToCssProp = (value: FixMeLater) => marginToCssProp(value);

// TODO: remove when rem is properly implemented in re-design as a whole (when not breaking legacy project)
/**
 * @description Does what the scss rem function does but in javascript
 */
// export const rem = (value: FixMeLater) => value ? `${value.toString().split('px')[0] / 16}rem` : 0

export const rem = (value: string): string => {
  if (!value) return '0';
  const pixelValue = parseFloat(value.split('px')[0]);
  if (isNaN(pixelValue)) return '0';
  const remValue = pixelValue / 16;
  return `${remValue}rem`;
};

export const isPhoneNumber = (str: string): boolean => /^[+0-9 -]*$/g.test(str);

export const validatePhoneNumber = (str: string) =>
  /^((((0{2}?)|(\+){1})46)|0)\d{5,15}$/g.test(str);

export const validateMobileNumber = (str: string) =>
  /^((((0{2}?)|(\+){1})46)|0)7[- ]*(\d[- ]*){8}$/.test(str);

export const cleanPhoneNumberString = (str: string) =>
  str.replace(/[^0-9+]/g, '');

export const validateZipCode = (str: string) =>
  /^[0-9]{3}[ ]?[0-9]{2}$/g.test(str);

export const validateEmail = (str: string) => {
  const result =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      str
    );

  if (result) {
    const domain = str.slice(str.indexOf('@') + 1, str.lastIndexOf('.'));
    return /^(\w)?.*\D.*(\w)?$/g.test(domain);
  } else return result;
};

/**
 * @returns {{ isMobile: boolean; isDesktop: boolean;}}
 */
export const useDeviceSize = () => {
  const isMatch = useMediaQuery(`(min-width: 1200px)`); // 👈 säker fallback
  return { isMobile: !isMatch, isDesktop: isMatch };
};

export const useDisableScroll = (isDisabled: boolean) => {
  useEffect(() => {
    if (isDisabled) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isDisabled]);
};

export const cleanEmail = (email: string) => {
  // Ta bort allt efter '@'
  const namePart = email.split('@')[0];
  return namePart;
};

export const getUserColor = (userId: string): string => {
  const colorPalette = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
  const hash = userId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
};
