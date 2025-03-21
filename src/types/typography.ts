export type Tags =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'psm'
  | 'pxs'
  | 'em'
  | 'label'
  | 'span';

export type TextVariants =
  | Tags
  | 'h1Plus'
  | 'span'
  | 'inputError'
  | 'labelError';

export type TextTransforms =
  | 'none'
  | 'capitalize'
  | 'lowercase'
  | 'uppercase'
  | 'inherit'
  | 'initial'
  | 'unset';

export type TextAligns = 'left' | 'right' | 'center';

type Sizes = 'sm' | 'md' | 'lg';

export type FontSizes = Sizes | 'xs' | 'xl';
export type LineHeight = Sizes | 'xs' | 'xl';
export type Spacing = Sizes | 'xl';
export type FontWeight = '400' | '600' | '700';

export type Display = 'inline' | 'block';
