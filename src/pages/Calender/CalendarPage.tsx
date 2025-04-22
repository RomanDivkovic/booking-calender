import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ref, push, set, onValue, remove } from 'firebase/database';
import { auth, db } from '../../../firebase';
import { Modal } from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import TextArea from '../../components/Textarea/Textarea';
import TextField from '../../components/Textfield/Textfield';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  user_id?: string;
};

const CalendarPage = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isUserEvent, setIsUserEvent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newEventDate, setNewEventDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState(1);
  const [newStartTime, setNewStartTime] = useState<string | null>('08:00');

  useEffect(() => {
    const bookingsRef = ref(db, 'bookings');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      const parsedEvents: CalendarEvent[] = [];

      for (const key in data) {
        const event = data[key];
        parsedEvents.push({
          id: key,
          title: event.title,
          description: event.description,
          start: event.start,
          end: event.end,
          user_id: event.user_id
        });
      }

      setEvents(parsedEvents);
    });
  }, []);

  const handleDateClick = (arg: { dateStr: string }) => {
    setNewEventDate(arg.dateStr);
    setNewStartTime('08:00');
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async () => {
    const user = auth.currentUser;
    if (!user || !newEventDate || !newStartTime || !newTitle) return;

    const [hours, minutes] = newStartTime.split(':').map(Number);
    const startDate = new Date(`${newEventDate}T00:00:00`);
    startDate.setHours(hours, minutes);
    const endDate = new Date(
      startDate.getTime() + newDuration * 60 * 60 * 1000
    );

    // Krockkontroll
    const overlapping = events.some((e) => {
      const existingStart = new Date(e.start);
      const existingEnd = new Date(e.end);
      return startDate < existingEnd && endDate > existingStart;
    });

    if (overlapping) {
      alert('Tiden krockar med en annan bokning.');
      return;
    }

    const newRef = push(ref(db, 'bookings'));
    await set(newRef, {
      title: newTitle,
      description: newDescription,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      user_id: user.uid,
      createdAt: new Date().toISOString()
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewStartTime('08:00');
    setNewDuration(1);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const currentUser = auth.currentUser;
    const isOwner = currentUser?.uid === event.extendedProps.user_id;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      description: event.extendedProps.description,
      user_id: event.extendedProps.user_id
    });

    setIsUserEvent(isOwner);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    const currentUser = auth.currentUser;
    if (currentUser?.uid !== selectedEvent.user_id) {
      alert('Du kan bara ta bort dina egna bokningar.');
      return;
    }

    await remove(ref(db, `bookings/${selectedEvent.id}`));
    setIsModalOpen(false);
  };

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events}
        eventContent={renderEventContent}
        height="auto"
      />

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
            <Button variant="error" onClick={handleDeleteEvent}>
              Ta bort
            </Button>
          )}
        </Modal>
      )}

      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          handleClose={() => setIsCreateModalOpen(false)}
          iconName="calendar"
          size="md"
          title="Create booking"
          closeButton={{ text: 'close', variant: 'text' }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <TextField
              label="Titel"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <TextArea
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <div>
              <label>start-time:</label>
              <TimePicker
                onChange={setNewStartTime}
                value={newStartTime}
                disableClock
                clearIcon={null}
              />
            </div>
            <TextField
              label="Varaktighet (timmar)"
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
            />
            <Button variant="primary" onClick={handleCreateEvent}>
              Create
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

function renderEventContent(eventInfo: any) {
  return (
    <div style={{ fontSize: '12px', padding: '4px' }}>
      <strong>{eventInfo.timeText}</strong>
      <div>{eventInfo.event.title}</div>
    </div>
  );
}

export default CalendarPage;
