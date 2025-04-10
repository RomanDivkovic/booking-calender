import Typography from '../../components/Typography/Typography';
import styles from './Home.module.scss';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Modal } from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import TextField from '../../components/Textfield/Textfield';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TextArea from '../../components/Textarea/Textarea';

type CalendarEvent = {
  id?: string;
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
  const [newTime, setNewTime] = useState<string | null>('12:00');
  const [newDuration, setNewDuration] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isUserEvent, setIsUserEvent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(
          'id, title, date, description, duration, user_id, profiles(color)'
        );

      if (!error && data) {
        setEvents(
          data.map((e) => {
            const start = new Date(e.date);
            const end = new Date(start);
            end.setHours(start.getHours() + (e.duration || 1));

            return {
              id: e.id,
              title: e.title,
              start: start.toISOString(),
              end: end.toISOString(),
              color: e.profiles?.color || '#ccc',
              description: e.description,
              user_id: e.user_id
            };
          })
        );
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (arg: any) => {
    const clickedDate = new Date(arg.dateStr);
    const iso = clickedDate.toISOString().split('T')[0];
    setNewDate(iso);
    setNewTime('12:00'); // Default time
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user || !newDate || !newTitle || !newTime) return;

    const [hours, minutes] = newTime.split(':').map(Number);
    const startDate = new Date(`${newDate}T00:00:00`);
    startDate.setHours(hours, minutes);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + newDuration);

    // Check for overlapping
    const overlapping = events.some((e) => {
      const existingStart = new Date(e.start);
      const existingEnd = new Date(e.end ?? existingStart);
      return startDate < existingEnd && endDate > existingStart;
    });

    if (overlapping) {
      alert('Tiden krockar med en annan bokning.');
      return;
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        title: newTitle,
        description: newDescription,
        date: startDate.toISOString(),
        user_id: user.id,
        duration: newDuration
      })
      .select('id, title, date, description, duration, profiles(color)')
      .single();

    if (!error && data) {
      setEvents((prev) => [
        ...prev,
        {
          id: data.id,
          title: data.title,
          start: data.date,
          end: new Date(
            new Date(data.date).getTime() + newDuration * 3600000
          ).toISOString(),
          description: data.description,
          color: data.profiles?.color || '#ccc'
        }
      ]);
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewDate('');
      setNewTime('12:00');
      setNewDuration(1);
    }
  };

  const handleEventClick = async (clickInfo: any) => {
    const event = clickInfo.event;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    const isOwner = !!user && event.extendedProps.user_id === user.id;

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
      <Typography variant="h1">Veckovy – Bokningar</Typography>
      <div style={{ maxWidth: '900px', marginTop: '2rem' }}>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          selectable
          dateClick={handleDateClick}
          height="auto"
          eventClick={handleEventClick}
        />
      </div>

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
            onChange={setNewTime}
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
    </div>
  );
}
