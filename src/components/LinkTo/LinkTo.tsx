import {
  marginToCssProp,
  isPhoneNumber,
  cleanPhoneNumberString
} from '../../utils/functions';
import { Icon, IconSizes } from '../Icon/Icon';
import styles from './LinkTo.module.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

type To = any;

export type Targets = '_self' | '_blank' | '_parent' | '_top';

export type InputMode =
  | 'email'
  | 'search'
  | 'text'
  | 'none'
  | 'tel'
  | 'url'
  | 'numeric'
  | 'decimal'
  | undefined;

type Margin =
  | { t?: number | string }
  | { b?: number | string }
  | { l?: number | string }
  | { r?: number | string }
  | { h?: number | string }
  | { v?: number | string }
  | undefined;

type LinkToProps = {
  href?: string;
  to?: To;
  mailto?: string;
  className?: string;
  children: React.ReactNode;
  iconSize?: IconSizes;
  expand?: boolean;
  target?: Targets;
  animation?: boolean;
  margin?: Margin;
  reloadDocument?: boolean;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onTouchStart?: React.TouchEventHandler;
  onTouchEnd?: React.TouchEventHandler;
  secondaryAnimation?: boolean;
  iconName?: string;
  displayLinkIcon?: boolean;
};

const LinkTo = ({
  href,
  to,
  mailto,
  target,
  className,
  children,
  expand,
  iconSize = 'sm',
  animation: primaryAnimation,
  displayLinkIcon,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  margin,
  secondaryAnimation,
  reloadDocument,
  iconName
}: LinkToProps) => {
  const linkClassNames = classNames({
    [styles.default]: !className,
    [styles.animation]: primaryAnimation,
    [styles['secondary-animation']]: secondaryAnimation,
    [styles.expand]: expand
  });

  const hrefString = isPhoneNumber(to)
    ? `tel:${cleanPhoneNumberString(to)}`
    : to;

  if (href) {
    if (href.startsWith('mailto:')) {
      return (
        <a
          className={linkClassNames}
          style={{
            margin: marginToCssProp(margin)
          }}
          target={target}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          href={hrefString}
        >
          {children}
          {displayLinkIcon && (
            <Icon name={iconName} margin={{ l: 4 }} size={iconSize} />
          )}
          {children}
        </a>
      );
    } else {
      return (
        <a
          style={{
            margin: marginToCssProp(margin)
          }}
          target={target}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          href={hrefString}
          className={linkClassNames}
        >
          {children}
        </a>
      );
    }
  } else if (to) {
    return (
      <Link
        reloadDocument={reloadDocument}
        style={{
          margin: marginToCssProp(margin)
        }}
        target={target}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        to={hrefString}
        className={linkClassNames}
      >
        {displayLinkIcon && (
          <Icon name={iconName} margin={{ l: 4 }} size={iconSize} />
        )}
        {children}
      </Link>
    );
  } else if (mailto) {
    return (
      <a
        style={{
          margin: marginToCssProp(margin)
        }}
        target={target}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        href={`mailto:${mailto}`}
        className={linkClassNames}
      >
        {displayLinkIcon && (
          <Icon name={iconName} margin={{ l: 4 }} size={iconSize} />
        )}
        {children}
      </a>
    );
  } else {
    return null;
  }
};

export default LinkTo;
