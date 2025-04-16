import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import styles from './BookingPage.module.scss';

type Booking = {
  id: string;
  title: string;
  date: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const db = getDatabase();
      const bookingsRef = ref(db, 'bookings');

      try {
        const snapshot = await get(bookingsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const filtered = Object.entries(data)
            .filter(([_, value]: any) => value.user_id === user.uid)
            .map(([id, value]: any) => ({
              id,
              title: value.title,
              date: value.start?.split('T')[0] || 'okänt datum'
            }));
          setBookings(filtered);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error('Fel vid hämtning av bokningar:', error);
        setBookings([]);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles['content-container']}>
        <h1 className="text-2xl font-bold">Mina bokningar</h1>
        <p>Här kan du se alla dina bokningar 📆</p>

        {loading ? (
          <p>Laddar bokningar...</p>
        ) : bookings.length === 0 ? (
          <p>Inga bokningar hittades.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="border p-3 rounded bg-white shadow"
              >
                <strong>{booking.title}</strong> – {booking.date}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
