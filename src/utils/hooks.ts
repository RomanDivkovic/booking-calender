import { useEffect, useState, RefObject } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import { ref, get, push, set, DatabaseReference } from 'firebase/database';
import { db } from '../firebase';

// Hook for handling click outside of an element
function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, ref]);
}

export default useOnClickOutside;

// Hook for managing user authentication state
// export const ygffg = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   return { user };
// };

// Example sign-up function that also handles group joining via invitation
export interface Invitation {
  groupRefKey: string;
}

export const useHandleSignUpWithInvitation = async (
  email: string,
  password: string,
  invitationCode: string
): Promise<void> => {
  const auth = getAuth(); // Make sure to initialize the Auth instance

  try {
    // Perform the sign-up process with Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUser: User | null = userCredential.user;

    if (invitationCode && newUser) {
      // Look up the invitation by invitationCode
      const inviteRef: DatabaseReference = ref(
        db,
        `invitations/${invitationCode}`
      );
      const inviteSnapshot = await get(inviteRef);

      if (inviteSnapshot.exists()) {
        const invitation: Invitation = inviteSnapshot.val();
        const { groupRefKey } = invitation;

        // Add the new user to the group's members list
        const groupRef: DatabaseReference = ref(
          db,
          `groups/${groupRefKey}/members`
        );
        await push(groupRef, newUser.email);

        // Update the invitation status to 'accepted'
        await set(ref(db, `invitations/${invitationCode}/status`), 'accepted');
      }
    }
  } catch (e: any) {
    console.error('Error handling sign-up with invitation: ', e);
  }
};

export const createGroup = async (
  leagueName: string,
  userId: string,
  userEmail: string,
  friendEmails: string[]
): Promise<string> => {
  const groupRef = push(ref(db, 'groups'));
  const groupId = groupRef.key!;

  const groupData = {
    name: leagueName,
    createdBy: userId,
    members: {
      [userId]: 'admin'
    },
    createdAt: new Date().toISOString()
  };

  await set(groupRef, groupData);
  return groupId;
};
