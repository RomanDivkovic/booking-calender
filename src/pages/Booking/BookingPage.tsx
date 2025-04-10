import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './BookingsPage.module.scss';

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
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('id, title, date')
        .eq('user_id', user.id);

      if (!error && data) {
        setBookings(data);
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
