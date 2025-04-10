import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { supabase } from '../../lib/supabase';
import { Modal } from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import TextArea from '../../components/Textarea/Textarea';
import TextField from '../../components/Textfield/Textfield';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

type CalendarEvent = {
  id?: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
  description?: string;
  user_id?: string;
  display_name?: string;
  duration: number;
};

const CalendarPage = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isUserEvent, setIsUserEvent] = useState(false);
  const [newEventDate, setNewEventDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDuration, setNewDuration] = useState(1);
  const [newStartTime, setNewStartTime] = useState<string | null>('08:00');

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: eventsData, error } = await supabase
        .from('bookings')
        .select(
          'id, title, date, user_id, description, duration, profiles!inner(color, display_name)'
        );

      if (!error && eventsData) {
        const eventsWithColor = eventsData.map((e: any) => {
          const profile = e.profiles || {};
          return {
            id: e.id,
            title: e.title,
            start: e.date,
            color: profile.color || '#ccc',
            description: e.description,
            user_id: e.user_id,
            display_name: profile.display_name || 'Okänd',
            duration: e.duration
          };
        });

        setEvents(eventsWithColor);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = async (arg: { dateStr: string }) => {
    const calendarApi = calendarRef.current?.getApi();
    const currentStart = calendarApi?.view.currentStart;
    const currentEnd = calendarApi?.view.currentEnd;
    const clickedDate = new Date(arg.dateStr);

    if (
      !currentStart ||
      !currentEnd ||
      clickedDate < currentStart ||
      clickedDate >= currentEnd
    ) {
      alert('Du kan bara lägga till bokningar i aktuell månad.');
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Du måste vara inloggad för att skapa en bokning.');
      return;
    }

    setNewEventDate(arg.dateStr);
    setNewTitle('');
    setNewDescription('');
    setNewDuration(1);
    setNewStartTime('08:00');
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user || !newEventDate || !newTitle) {
      alert('Alla fält måste fyllas i.');
      return;
    }

    if (!newStartTime) {
      alert('Du måste välja en starttid.');
      return;
    }

    const dateWithHour = `${newEventDate}T${newStartTime}:00`;

    // Beräkna sluttid baserat på starttid + duration
    const [startHour, startMinute] = newStartTime.split(':').map(Number);
    const startDateObj = new Date(newEventDate!);
    startDateObj.setHours(startHour, startMinute);
    const endDateObj = new Date(
      startDateObj.getTime() + newDuration * 60 * 60 * 1000
    );
    const endDate = endDateObj.toISOString();

    // Kontrollera att det finns lediga timmar på dagen
    const selectedDateOnly = new Date(dateWithHour).toISOString().split('T')[0];
    const bookingsOnSameDay = events.filter((e) => {
      const eventDate = new Date(e.start).toISOString().split('T')[0];
      return eventDate === selectedDateOnly;
    });

    const totalBookedHours = bookingsOnSameDay.reduce(
      (sum, e) => sum + (e.duration || 1),
      0
    );

    if (totalBookedHours + newDuration > 24) {
      alert(
        `Det finns inte tillräckligt med timmar kvar denna dag. Endast ${
          24 - totalBookedHours
        } timmar är lediga.`
      );
      return;
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          title: newTitle,
          description: newDescription,
          date: dateWithHour,
          user_id: user.id,
          duration: newDuration
        }
      ])
      .select()
      .single();

    const { data: profile } = await supabase
      .from('profiles')
      .select('color, display_name')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setEvents((prev) => [
        ...prev,
        {
          id: data.id,
          title: data.title,
          start: data.date,
          end: endDate,
          description: data.description,
          user_id: data.user_id,
          color: profile?.color,
          display_name: profile?.display_name,
          duration: data.duration
        }
      ]);
      setIsCreateModalOpen(false);
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
      description: event.extendedProps.description,
      color: event.backgroundColor,
      user_id: event.extendedProps.user_id,
      display_name: event.extendedProps.display_name,
      duration: event.extendedProps.duration
    });
    setIsUserEvent(isOwner);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', selectedEvent.id);
    if (!error) {
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setIsModalOpen(false);
    } else {
      alert('Kunde inte ta bort bokningen.');
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent?.id) return;

    const newTitle = prompt('Ny titel:', selectedEvent.title);
    const newDesc = prompt('Ny beskrivning:', selectedEvent.description);

    if (!newTitle) return;

    const { data, error } = await supabase
      .from('bookings')
      .update({ title: newTitle, description: newDesc })
      .eq('id', selectedEvent.id)
      .select()
      .single();

    if (!error && data) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === data.id
            ? { ...e, title: data.title, description: data.description }
            : e
        )
      );
      setIsModalOpen(false);
    } else {
      alert('Kunde inte uppdatera bokningen.');
    }
  };

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events.map((event) => ({
          ...event,
          start: event.start || event.start,
          end:
            event.end ||
            new Date(
              new Date(event.start).getTime() +
                (event.duration || 1) * 60 * 60 * 1000
            ),
          backgroundColor: event.color
        }))}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height="auto"
      />
      {selectedEvent && (
        <Modal
          isOpen={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          iconName="info"
          size="md"
          title={selectedEvent.title}
          text={`${selectedEvent.description || 'Ingen beskrivning.'}\nSkapad av: ${selectedEvent.display_name || 'Okänd'}`}
          closeButton={{ text: 'close', variant: 'text' }}
        >
          {isUserEvent && (
            <>
              <Button variant="primary" onClick={handleEditEvent}>
                Redigera
              </Button>
              <Button variant="error" onClick={handleDeleteEvent}>
                Ta bort
              </Button>
            </>
          )}
        </Modal>
      )}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          handleClose={() => setIsCreateModalOpen(false)}
          iconName="calendar"
          size="lg"
          title="create event"
          closeButton={{ text: 'close', variant: 'text' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '250px',
              alignContent: 'center',
              alignItems: 'center'
            }}
          >
            <TextField
              type="text"
              label="Titel"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <TextArea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              label={'Description'}
            />
            <div style={{ marginBottom: '1rem', width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Starttid
              </label>
              <TimePicker
                onChange={setNewStartTime}
                value={newStartTime}
                disableClock
                clearIcon={null}
                format="HH:mm"
              />
            </div>
            <TextField
              label="Antal timmar"
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
            />
          </div>
          <Button variant="primary" onClick={handleCreateEvent}>
            Skapa
          </Button>
        </Modal>
      )}
    </>
  );
};

function renderEventContent(eventInfo: any) {
  return (
    <div
      style={{
        backgroundColor: eventInfo.event.backgroundColor,
        color: 'white',
        padding: '2px 4px',
        borderRadius: '4px',
        fontSize: '12px',
        width: '100%',
        cursor: 'pointer'
      }}
    >
      <b>{eventInfo.timeText}</b> <br />
      <span>{eventInfo.event.title}</span>
    </div>
  );
}

export default CalendarPage;
