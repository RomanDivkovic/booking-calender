import React, { useState, useRef, ReactEventHandler, ReactNode } from 'react';
import styles from './Modal.module.scss';
import classNames from 'classnames';
import Typography from '../Typography/Typography';
import Button from '../Button/Button';
import { Icon, IconNames, IconSizes } from '../Icon/Icon';
import { useDeviceSize, useDisableScroll } from '../../utils/functions';
import { ButtonVariants, TextAligns } from '../../types';

export type ModalSizes = 'sm' | 'md' | 'lg';

interface Props {
  iconName: IconNames;
  iconSize?: IconSizes;
  size?: ModalSizes;
  title: string | string[] | React.ReactNode;
  text?: string | string[] | React.ReactNode;
  align?: TextAligns;
  isOpen: boolean;
  handleClose: () => void;
  children?: ReactNode;
  closeButton?: { variant: ButtonVariants; text: string };
}

export const Modal = ({
  iconName = 'info',
  iconSize = 'xxl',
  size = 'sm',
  title,
  text,
  align = 'center',
  isOpen,
  handleClose,
  children,
  closeButton = { variant: 'primary', text: 'ok' }
}: Props) => {
  const [closeModalAnimation, setCloseModalAnimation] =
    useState<boolean>(false);

  useDisableScroll(isOpen);

  const { isDesktop, isMobile } = useDeviceSize();
  const backgroundRef = useRef<HTMLDivElement>(null);

  const backgroundClassNames = classNames({
    [styles.background]: true,
    [styles['background-open']]: isOpen,
    [styles['background-close']]: closeModalAnimation
  });
  const modalClassNames = classNames({
    [styles['modal-base']]: true,
    [styles['modal-lg']]: size === 'lg',
    [styles['modal-md']]: size === 'md',
    [styles['modal-sm']]: size === 'sm',
    [styles['modal-open']]: isOpen,
    [styles['modal-close-down']]: closeModalAnimation && isMobile,
    [styles['modal-close-up']]: closeModalAnimation && isDesktop
  });
  const contentClassNames = classNames({
    [styles['content-base']]: true,
    [styles['content-lg']]: size === 'lg',
    [styles['content-md']]: size === 'md',
    [styles['content-sm']]: size === 'sm'
  });
  const buttonContainerClassNames = classNames({
    [styles['buttons-base']]: true,
    [styles['buttons-lg']]: size === 'lg',
    [styles['buttons-md']]: size === 'md',
    [styles['buttons-sm']]: size === 'sm'
  });

  const closeModal: ReactEventHandler = (ev) => {
    ev.preventDefault();
    setCloseModalAnimation(true);

    const handleAnimation = () => {
      setCloseModalAnimation(false);
      handleClose();
    };

    const currentRef = backgroundRef.current;
    if (currentRef) {
      currentRef.addEventListener('animationend', () => handleAnimation());
      currentRef.removeEventListener('animationend', () => handleAnimation());
    }
  };

  const handleBackgroundClick = (ev: React.MouseEvent) => {
    const target = ev.target as HTMLDivElement;
    if (target.id === 'modal-background') {
      ev.preventDefault();
      closeModal(ev);
    }
  };

  const iconBottomMargin = isMobile && size === 'sm' ? 28 : 44;

  const getTitleBottomMargin = () => {
    if (isMobile && size !== 'sm') return 32;
    else if (isMobile && size === 'sm') return 24;
    else if (isDesktop && size !== 'sm') return 24;
    else if (isDesktop && size === 'sm') return 16;
  };

  return (
    <>
      {isOpen && (
        <div
          id="modal-background"
          className={backgroundClassNames}
          onClick={handleBackgroundClick}
          ref={backgroundRef}
        >
          <div className={modalClassNames}>
            <div className={contentClassNames}>
              <Icon
                name={iconName}
                size={iconSize}
                margin={{ b: iconBottomMargin }}
              />
              <Typography
                variant="h2"
                align="center"
                margin={{ b: getTitleBottomMargin() }}
              >
                {title}
              </Typography>
              <Typography
                variant="p"
                align={align}
                // fontSize={bodyTextFontSize}
                margin={{}}
              >
                {text}
              </Typography>
            </div>
            <div className={buttonContainerClassNames}>
              {children}
              <Button expand variant={closeButton.variant} onClick={closeModal}>
                {closeButton.text}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
