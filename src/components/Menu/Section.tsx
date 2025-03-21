import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import Typography from '../Typography/Typography';
import Button from '../Button/Button';
import ListItems from './ListItem';
import {
  CONTACT,
  GROUPS,
  INVITATIONS,
  PROFILE,
  BETS
} from '../../utils/UrlPaths';
import styles from './Menu.module.scss';

interface SectionItem {
  display: string;
  to: string;
  icon: string;
  iconSize: string;
  badgeCount?: number;
}

interface Section {
  title: string;
  items: SectionItem[];
}

const sections: Section[] = [
  {
    title: 'Bets',
    items: [
      { display: 'Bets', to: BETS.ROOT_PATH, icon: 'betting', iconSize: 'lg' },
      {
        display: 'Groups',
        to: GROUPS.ROOT_PATH,
        icon: 'account-group',
        iconSize: 'lg'
      }
    ]
  },
  {
    title: 'Invitations',
    items: [
      {
        display: 'Invitations',
        to: INVITATIONS.INVITED,
        icon: 'inbox',
        iconSize: 'lg',
        badgeCount: 0
      },
      {
        display: 'Invite',
        to: INVITATIONS.INVITE,
        icon: 'user-plus',
        iconSize: 'lg'
      }
    ]
  },
  {
    title: 'Profile',
    items: [
      {
        display: 'Profile',
        to: PROFILE.ROOT_PATH,
        icon: 'user',
        iconSize: 'lg'
      }
    ]
  },
  {
    title: 'Information',
    items: [
      { display: 'FAQ', to: CONTACT.ROOT_PATH, icon: 'info', iconSize: 'lg' },
      { display: 'Help', to: '/help', icon: 'info', iconSize: 'lg' }
    ]
  }
];
const Section: React.FC = () => {
  const [invitationCount, setInvitationCount] = useState(0);
  const [userGroups, setUserGroups] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const userEmail = auth.currentUser?.email;
    const userId = auth.currentUser?.uid;

    if (userEmail) {
      // Hämta inbjudningar för att visa badgeCount
      const invitationsRef = ref(db, `invitations`);
      onValue(invitationsRef, (snapshot) => {
        let count = 0;
        snapshot.forEach((childSnapshot) => {
          const invitation = childSnapshot.val();
          if (
            invitation.email === userEmail &&
            invitation.status === 'pending'
          ) {
            count++;
          }
        });
        setInvitationCount(count);
      });
    }

    if (userId) {
      // Hämta användarens grupper
      const userGroupsRef = ref(db, `users/${userId}/groups`);
      onValue(userGroupsRef, (snapshot) => {
        const groups: { id: string; name: string }[] = [];
        snapshot.forEach((childSnapshot) => {
          groups.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setUserGroups(groups);
      });
    }
  }, []);

  return (
    <div>
      {sections.map((section, index) => (
        <div key={index} className={styles.section}>
          <Typography variant="h2" className={styles.sectionTitle}>
            {section.title}
          </Typography>
          <nav className={styles.items}>
            {section.items.map((item, idx) => (
              <ListItems
                key={idx}
                display={item.display}
                to={item.to}
                icon={item.icon}
                iconSize={item.iconSize}
                badgeCount={
                  item.display === 'Invitations' ? invitationCount : undefined
                }
              />
            ))}
          </nav>
        </div>
      ))}

      <div className={styles.section}>
        <Typography variant="h2" className={styles.sectionTitle}>
          Your Groups
        </Typography>
        {userGroups.length > 0 ? (
          <nav className={styles.items}>
            {userGroups.map((group) => (
              <ListItems
                key={group.id}
                display={group.name}
                to={`${GROUPS.ROOT_PATH}/${group.id}`}
                icon="account-group"
                iconSize="lg"
              />
            ))}
          </nav>
        ) : (
          <div className={styles.noGroups}>
            <Typography variant="p">
              You are not a member of any groups.
            </Typography>
            <Button
              onClick={() => (window.location.href = GROUPS.CREATE)}
              variant="primary"
              margin={{ t: '15px' }}
            >
              Create a Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Section;
