import collection from '../../assets/icons/collection.svg';
import scss from '../../styles/index.module.scss';
import { rem, marginToCssProp } from '../../utils/functions';

export type IconSizes = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type IconColors =
  | 'primary'
  | 'success'
  | 'error'
  | 'secondary'
  | 'hover'
  | 'disabled';

export type IconNames =
  | 'user'
  | 'cross-circle'
  | 'home'
  | 'heart'
  | 'settings'
  | 'cross'
  | 'share-link'
  | 'calender'
  | 'info'
  | 'completed'
  | 'search'
  | 'nav-arrow-up'
  | 'nav-arrow-right'
  | 'arrow-right'
  | 'nav-arrow-down'
  | 'nav-arrow-left'
  | 'chevron-up'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'phone'
  | 'notifications'
  | 'angel-left'
  | 'angel-right'
  | 'angel-circle-left'
  | 'angel-circle-right'
  | 'angel-circle-up'
  | 'angel-circle-down'
  | 'menu'
  | 'bars'
  | 'menu-burger'
  | 'account-group'
  | 'user-alt'
  | 'user-add'
  | 'boxing'
  | 'karate'
  | 'mma'
  | 'person-boxing'
  | 'betting'
  | 'google'
  | string
  | undefined;

type Margin =
  | { t?: number | string }
  | { b?: number | string }
  | { l?: number | string }
  | { r?: number | string }
  | { h?: number | string }
  | { v?: number | string }
  | undefined;

const sizes = {
  sm: rem('12px'),
  md: rem('16px'),
  lg: rem('24px'),
  xl: rem('32px'),
  xxl: rem('72px')
};

const colors = {
  primary: scss.primaryGold,
  secondary: scss.primaryWhite,
  success: scss.success,
  error: scss.error,
  hover: scss.accentsHoverBlue,
  disabled: scss.disabled
};

/**
 * @description Api for rendering various svg-icons
 */

interface Props {
  name: IconNames;
  size?: IconSizes;
  color?: IconColors;
  margin?: Margin;
  className?: string;
  onClick?: () => void;
  flipIconDirection?: boolean;
}

export const Icon = ({
  name,
  size = 'md',
  color = 'primary',
  margin,
  className,
  flipIconDirection,
  onClick
}: Props) => {
  return (
    <div
      style={{
        margin: marginToCssProp(margin),
        cursor: 'pointer',
        ...(flipIconDirection ? { transform: 'rotate(180deg)' } : {})
      }}
      className={className} // Använd className här
      onClick={onClick}
    >
      <svg
        height={sizes[size]}
        width={sizes[size]}
        stroke={colors[color]}
        fill={colors[color]}
      >
        <use xlinkHref={`${collection}#${name}`} />
      </svg>
    </div>
  );
};
