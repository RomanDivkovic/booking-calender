import React from 'react';
import styles from './Footer.module.scss';
import { useDeviceSize } from '../../utils/functions';
import { Logo } from '../Logo/Logo';
import { isWebUrl } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import classNames from 'classnames';
import Typography from '../Typography/Typography';
import { CONTACT, EXTERNAL } from '../../utils/UrlPaths';
import LinkTo from '../LinkTo/LinkTo';

type SectionType = {
  header: string;
  links: {
    display: string;
    to: string;
    request?: string;
  }[];
};

type FooterProps = {
  signedIn: boolean;
  sections?: SectionType[];
  text?: string;
};

const _sections: SectionType[] = [
  {
    header: 'Calender',
    links: [
      {
        display: 'Shared calender',
        to: `/calendar`
      },
      {
        display: 'Your information',
        to: `/profile`
      },
      {
        display: 'Your bookings',
        to: `/bookings`
      }
    ]
  },
  {
    header: 'Contact',
    links: [
      {
        display: 'Contact ',
        to: CONTACT.ROOT_PATH
      },
      {
        display: 'About ',
        to: CONTACT.about
      }
    ]
  },
  {
    header: 'My social media',
    links: [
      {
        display: 'Instagram',
        to: EXTERNAL.instagram
      },
      {
        display: 'Facebook',
        to: EXTERNAL.facebook
      },
      {
        display: 'LinkedIn',
        to: EXTERNAL.linkedin
      }
    ]
  }
];

export const Footer = ({ signedIn, sections = _sections }: FooterProps) => {
  const desktopClassNames = classNames({
    [styles.desktop]: true,
    [styles['desktop-logged-in']]: signedIn
  });
  const { isDesktop } = useDeviceSize();
  const navigate = useNavigate();

  const text = `Small calendar and booking system to be able and use the wash room without bothering each other or trying to do it at the same time. Easy to book and easy to see when someone has booked`;

  return isDesktop ? (
    <footer data-track="footer_desktop" className={desktopClassNames}>
      <div className={styles.content}>
        <div className={styles['column-desktop']}>
          <div style={{ width: '200px' }}>
            <Logo
              onClick={() => navigate('./')}
              color="cleanNewLogo"
              margin={{ t: 100 }}
              size="lg"
            />
          </div>
          <Typography
            className={styles['text-content']}
            margin={{ l: 20, t: 100 }}
            variant="p-white"
          >
            {text}
          </Typography>
        </div>
        {signedIn && (
          <div className={styles['section-row']}>
            {sections.map((section, index) => (
              <RenderSections key={index} data={section} />
            ))}
          </div>
        )}
      </div>
    </footer>
  ) : (
    <footer
      data-track="footer_mobile"
      className={styles['mobile-container-signed-in']}
    >
      <div>
        <Logo
          onClick={() => navigate('./')}
          color="cleanNewLogo"
          margin={{ b: 10 }}
          size="xs"
        />

        {signedIn && (
          <div>
            <div className={styles['first-section']}>
              {sections.map((section, index) => (
                <RenderSections key={index} data={section} />
              ))}
            </div>
          </div>
        )}
        <div className={styles['text-div']}>
          <Typography variant="p-white">{text}</Typography>
        </div>
      </div>
    </footer>
  );
};

const RenderSections: React.FC<{ data: SectionType }> = ({
  data: { header, links: linkData }
}) => {
  return (
    <section>
      <Typography margin={{ b: 0 }} variant="h5">
        {header}
      </Typography>
      <nav className={styles.columnSections}>
        {linkData &&
          linkData.map((data, i) => (
            <SectionLink key={i.toString()} data={data} />
          ))}
      </nav>
    </section>
  );
};

type Props = {
  data: {
    to: string;
    display: string;
    request?: string;
  };
};

const SectionLink = ({ data: { to, display } }: Props) => {
  const { isDesktop } = useDeviceSize();
  console.log(isDesktop);
  if (isWebUrl(to)) {
    return isDesktop ? (
      <div className={styles.box}>
        <LinkTo className={styles['link-to']} secondaryAnimation to={to}>
          <div className={styles.links}>
            <a
              target="_blank"
              className={styles.link}
              href={to}
              rel="noreferrer"
            >
              <Icon
                margin={{ r: '16px' }}
                color="secondary"
                size="sm"
                name="share-link"
              />
              {display}
            </a>
          </div>
        </LinkTo>
      </div>
    ) : (
      <div className={styles.box}>
        <LinkTo className={styles['link-to']} secondaryAnimation to={to}>
          <div className={styles.links}>
            <a
              target="_blank"
              className={styles.link}
              href={to}
              rel="noreferrer"
            >
              {display}
            </a>
          </div>
        </LinkTo>
      </div>
    );
  }
  return (
    <div className={styles.box}>
      <LinkTo className={styles['link-to']} secondaryAnimation to={to}>
        <div className={styles.links}>
          <Typography size="xs" variant="p-white">
            {display}
          </Typography>
        </div>
      </LinkTo>
    </div>
  );
};
