import { useEffect, useState } from 'react';
import { onValue, ref, push, set } from 'firebase/database';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../../../firebase';
import styles from './Home.module.scss';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal } from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import TextField from '../../components/Textfield/Textfield';
import TimePicker from 'react-time-picker';
import TextArea from '../../components/Textarea/Textarea';
import { useDeviceSize } from '../../utils/functions';
import { motion, AnimatePresence } from 'framer-motion';

import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { LoadingScreen } from '../LoadingScreen/LoadingScreen';

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  color?: string;
  description?: string;
  user_id?: string;
};

export default function HomePage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState<string>('12:00');
  const [newDuration, setNewDuration] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isUserEvent, setIsUserEvent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  const { isMobile } = useDeviceSize();

  // 🔒 Vänta på auth innan vi börjar lyssna på data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔁 Lyssna på bokningar
  useEffect(() => {
    if (!currentUser) return;

    const bookingsRef = ref(db, 'bookings');
    const profilesRef = ref(db, 'profiles');

    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const allBookings = Object.entries(data).map(([id, booking]: any) => ({
        id,
        ...booking
      }));

      onValue(profilesRef, (profileSnap) => {
        const profiles = profileSnap.val() || {};
        const enriched = allBookings.map((booking) => ({
          ...booking,
          color: profiles?.[booking.user_id]?.color || '#ccc'
        }));
        setEvents(enriched);
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDateClick = (arg: any) => {
    const dateStr = new Date(arg.dateStr).toISOString().split('T')[0];
    setNewDate(dateStr);
    setNewTime('12:00');
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async () => {
    if (!currentUser || !newDate || !newTitle || !newTime) return;

    const [hour, min] = newTime.split(':').map(Number);
    const start = new Date(`${newDate}T00:00:00`);
    start.setHours(hour, min);
    const end = new Date(start);
    end.setHours(start.getHours() + newDuration);

    const bookingData = {
      title: newTitle,
      description: newDescription,
      start: start.toISOString(),
      end: end.toISOString(),
      user_id: currentUser.uid,
      createdAt: new Date().toISOString()
    };

    const newRef = push(ref(db, 'bookings'));
    await set(newRef, bookingData);

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewDate('');
    setNewTime('12:00');
    setNewDuration(1);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const isOwner = currentUser?.uid === event.extendedProps.user_id;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      description: event.extendedProps.description,
      color: event.backgroundColor,
      user_id: event.extendedProps.user_id
    });

    setIsUserEvent(isOwner);
    setIsModalOpen(true);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className={styles.container}>
      <div className={styles['content-container']}>
        <Button
          variant="secondary"
          onClick={() => setShowCalendar((prev) => !prev)}
        >
          {showCalendar ? 'Hide calendar' : 'Show calendar'}
        </Button>

        <AnimatePresence>
          {showCalendar && (
            <motion.div
              className={`${styles.card} ${styles['card-3d']}`}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <FullCalendar
                plugins={[
                  timeGridPlugin,
                  dayGridPlugin,
                  listPlugin,
                  interactionPlugin
                ]}
                initialView="timeGridWeek"
                headerToolbar={
                  isMobile
                    ? {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                      }
                    : {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                      }
                }
                events={events}
                selectable
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height="auto"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
        iconName="calendar"
        size="md"
        title="Create new event"
        closeButton={{ text: 'Close', variant: 'text' }}
      >
        <TextField
          label="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <TextArea
          label="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block' }}>
            Start time:
          </label>
          <TimePicker
            onChange={(value) => setNewTime(value ?? '12:00')}
            value={newTime}
            disableClock
            clearIcon={null}
            format="HH:mm"
          />
        </div>
        <TextField
          label="Duration (hours)"
          value={newDuration}
          onChange={(e) => setNewDuration(Number(e.target.value))}
        />
        <Button variant="primary" onClick={handleCreateEvent}>
          Create
        </Button>
      </Modal>

      {/* View Event Modal */}
      {selectedEvent && (
        <Modal
          isOpen={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          iconName="calendar"
          size="md"
          title={selectedEvent.title}
          text={selectedEvent.description || 'No description'}
          closeButton={{ text: 'Close', variant: 'text' }}
        >
          {isUserEvent && (
            <p>
              {new Date(selectedEvent.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}{' '}
              -{' '}
              {new Date(selectedEvent.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
