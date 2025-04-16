import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { getAuth } from 'firebase/auth';
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

import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { useDeviceSize } from '../../utils/functions';

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

  const auth = getAuth();
  const user = auth.currentUser;

  const { isMobile } = useDeviceSize();

  useEffect(() => {
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
  }, []);

  const handleDateClick = (arg: any) => {
    const dateStr = new Date(arg.dateStr).toISOString().split('T')[0];
    setNewDate(dateStr);
    setNewTime('12:00');
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async () => {
    if (!user || !newDate || !newTitle || !newTime) return;

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
      user_id: user.uid,
      createdAt: new Date().toISOString()
    };

    const { push, set } = await import('firebase/database');
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
    const isOwner = user?.uid === event.extendedProps.user_id;

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

  return (
    <div className={styles.container}>
      <div className={styles['content-container']}>
        <div className={`${styles.card} ${styles['card-3d']}`}>
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
        </div>
      </div>

      {/* Skapa nytt event */}
      <Modal
        isOpen={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
        iconName="calendar"
        size="md"
        title="Skapa ny bokning"
        closeButton={{ text: 'Stäng', variant: 'text' }}
      >
        <TextField
          label="Titel"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <TextArea
          label="Beskrivning"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block' }}>
            Starttid:
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
          label="Varaktighet i timmar"
          value={newDuration}
          onChange={(e) => setNewDuration(Number(e.target.value))}
        />
        <Button variant="primary" onClick={handleCreateEvent}>
          Skapa
        </Button>
      </Modal>

      {/* Visa event */}
      {selectedEvent && (
        <Modal
          isOpen={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          iconName="calendar"
          size="md"
          title={selectedEvent.title}
          text={selectedEvent.description || 'Ingen beskrivning'}
          closeButton={{ text: 'Stäng', variant: 'text' }}
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
