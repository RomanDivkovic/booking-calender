import { ref, push, set } from 'firebase/database';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';

type Booking = {
  title: string;
  description?: string;
  start: string;
  end: string;
};

export const createBooking = async (booking: Booking) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Du måste vara inloggad för att skapa en bokning.');
  }

  const allBookingsRef = ref(db, `bookings`);
  const newBookingRef = push(allBookingsRef);

  await set(newBookingRef, {
    ...booking,
    user_id: user.uid,
    createdAt: new Date().toISOString()
  });

  return {
    id: newBookingRef.key,
    ...booking
  };
};
