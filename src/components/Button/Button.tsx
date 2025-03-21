import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';
import { ClipLoader } from 'react-spinners';
import { marginToCssProp } from '../../utils/functions';
import { Icon, IconColors, IconSizes } from '../Icon/Icon';

type Margin =
  | { t?: number | string }
  | { b?: number | string }
  | { l?: number | string }
  | { r?: number | string }
  | { h?: number | string }
  | { v?: number | string }
  | undefined;

type Target = '_blank';

type Http = 'http://' | 'https://';
type LinkStartsWith = Http | 'www.' | 'tel:' | 'mailto:' | '/' | '#';

export type To = `${LinkStartsWith}${string}`;

type ButtonProps = {
  small?: boolean;
  tiny?: boolean;
  variant: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  disabled?: boolean;
  expand?: boolean;
  to?: To;
  loading?: boolean;
  margin?: Margin;
  tagetTo?: Target;
  iconLeft?: string;
  iconRight?: string;
  childMargin?: Margin;
  iconColor?: IconColors;
  iconSize?: IconSizes;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant,
  disabled = false,
  expand = false,
  to,
  small = false,
  tiny = false,
  loading = false,
  margin,
  tagetTo = '_blank',
  iconLeft,
  iconRight,
  childMargin,
  iconSize,
  iconColor
}) => {
  const root = classNames({
    [styles.primary]: variant === 'primary',
    [styles['primary-disabled']]: variant === 'primary' && disabled,
    [styles.secondary]: variant.includes('secondary'),
    [styles['secondary-disabled']]: variant.includes('secondary') && disabled,
    [styles.light]: variant === 'secondary-light',
    [styles.dark]: variant === 'secondary-dark',
    [styles.text]: variant === 'text',
    [styles['text-disabled']]: variant === 'text' && disabled,
    [styles.danger]: variant === 'danger',
    [styles['danger-disabled']]: variant === 'danger' && disabled,
    [styles.small]: variant === 'small',
    [styles['small-base']]: small,
    [styles.expand]: expand,
    [styles['link-button-base']]: !!to,
    [styles.tiny]: tiny
  });

  const marginStyles = marginToCssProp(margin);

  const TextContent = () => (
    <div className={styles.textContent}>
      {iconLeft && (
        <Icon
          name={iconLeft}
          color={iconColor}
          size={iconSize}
          margin={{ b: 3, r: 5 }}
        />
      )}
      <div
        className={styles['button-text']}
        style={{ margin: marginToCssProp(childMargin) }}
      >
        {loading ? <ClipLoader color="white" size={34} /> : children}
      </div>
      {iconRight && (
        <Icon
          name={iconRight}
          margin={{ b: 3, l: 5 }}
          color={iconColor}
          size={iconSize}
        />
      )}
    </div>
  );

  const Button = () => (
    <button
      className={root}
      onClick={onClick}
      disabled={loading || disabled}
      style={{ margin: marginStyles }}
    >
      {TextContent()}
    </button>
  );

  const LinkButton = () => (
    <a
      className={root}
      href={to}
      target={tagetTo}
      rel="noreferrer"
      style={{ margin: marginStyles }}
    >
      {TextContent()}
    </a>
  );

  return to ? <LinkButton /> : <Button />;
};

export default Button;
