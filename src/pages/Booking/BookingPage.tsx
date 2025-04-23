import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, remove } from 'firebase/database';
import styles from './BookingPage.module.scss';
import CustomAlert from '../../components/Alert/Alert';
import Typography from '../../components/Typography/Typography';
import { LoadingScreen } from '../LoadingScreen/LoadingScreen';

type Booking = {
  id: string;
  title: string;
  date: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    const db = getDatabase();
    const bookingRef = ref(db, `bookings/${id}`);
    try {
      await remove(bookingRef);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Kunde inte ta bort bokningen:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['content-container']}>
        <Typography variant="h1">My bookings</Typography>
        <Typography variant="p">Here are your bookings 📆</Typography>

        {loading ? (
          <LoadingScreen />
        ) : bookings.length === 0 ? (
          <p>Inga bokningar hittades.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {bookings.map((booking) => (
              <li key={booking.id} className={styles.bookingItem}>
                <div className={styles.bookingInfo}>
                  <Typography variant="p">
                    <strong>{booking.title}</strong> – {booking.date}
                  </Typography>
                  <button
                    onClick={() => setConfirmDeleteId(booking.id)}
                    className={styles.deleteButton}
                    aria-label="Delete booking"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {confirmDeleteId && (
        <CustomAlert
          visible={true}
          onClose={() => setConfirmDeleteId(null)}
          title="Ta bort bokning?"
          body="Vill du verkligen ta bort din bokning? Detta går inte att ångra."
          buttons={[
            {
              text: 'Avbryt',
              onPress: () => setConfirmDeleteId(null)
            },
            {
              text: 'Ja, ta bort',
              onPress: () => {
                handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }
            }
          ]}
        />
      )}
    </div>
  );
}
