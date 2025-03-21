import { JSX, ReactNode } from 'react';
import styles from './Typography.module.scss';
import { marginToCssProp } from '../../utils/functions';
import { TextAligns } from '../../types';

type TextVariants =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'em'
  | 'label'
  | 'label-error'
  | 'input-error'
  | 'h3-white'
  | 'p-white';

type Tags = keyof JSX.IntrinsicElements;

type TextTransforms = 'capitalize' | 'uppercase' | 'lowercase' | 'none';

type FontSizes =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';
type FontWeight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

type LineHeight = 'none' | 'shorter' | 'short' | 'normal' | 'tall' | 'taller';
type Spacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
type Display =
  | 'none'
  | 'inline'
  | 'inline-block'
  | 'block'
  | 'table'
  | 'table-cell';

type Margin =
  | { t?: number | string }
  | { b?: number | string }
  | { l?: number | string }
  | { r?: number | string }
  | { h?: number | string }
  | { v?: number | string }
  | undefined;

type TypographyProps = {
  variant: TextVariants;
  tag?: Tags;
  size?: FontSizes;
  weight?: FontWeight;
  lineHeight?: LineHeight;
  letterSpacing?: Spacing;
  transform?: TextTransforms;
  align?: TextAligns;
  margin?: Margin;
  display?: Display;
  className?: string;
  children: ReactNode;
};

const Typography = ({
  variant = 'p',
  tag = variant as Tags,
  size = 'base',
  weight = 'normal',
  lineHeight = 'normal',
  letterSpacing = 'normal',
  transform = 'none',
  align = 'left',
  margin,
  display = 'block',
  className,
  children
}: TypographyProps) => {
  const Tag = tag;

  const marginStyles = marginToCssProp(margin);

  const baseClasses = `${styles[variant]} ${styles[size]} ${styles[weight]} ${styles[lineHeight]} ${styles[letterSpacing]} ${styles[transform]} ${styles[align]} ${styles[display]}`;

  return (
    <Tag
      className={`${baseClasses} ${className}`}
      style={{ margin: marginStyles }}
    >
      {children}
    </Tag>
  );
};

export default Typography;
