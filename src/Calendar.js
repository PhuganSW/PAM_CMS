import React, { useEffect, useState, useContext } from 'react';
import { gapi } from 'gapi-script';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from './Layout';
import './Home.css';
import './Calendar.css'; // Create and import your CSS for custom styles
import firestore from './Firebase/Firestore';
import { UserContext } from './UserContext';

const CLIENT_ID = '869699175876-mqt0r0crshde3ij7lt61krmcq8oipr1n.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCKgVX5urTZGB-bYs0bhUn94E3DgYnEOZ8';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function CalendarPage() {
  const { companyId } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        // gapi.auth2.getAuthInstance().signIn().then(() => {
        //   loadCalendarEvents();
        // });
      });
    }
    const loadAllNotes = async () => {
      try {
        const allNotes = await firestore.loadAllNotes(companyId);
        setNotes(allNotes);
      } catch (error) {
        console.error('Failed to load all notes:', error);
      }
    };
    gapi.load('client:auth2', start);
    loadAllNotes();
  }, [companyId]);

  // const loadCalendarEvents = () => {
  //   gapi.client.calendar.events.list({
  //     calendarId: 'primary',
  //     timeMin: (new Date()).toISOString(),
  //     showDeleted: false,
  //     singleEvents: true,
  //     maxResults: 10,
  //     orderBy: 'startTime',
  //   }).then(response => {
  //     const events = response.result.items;
  //     setEvents(events);
  //   });
  // };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    const dateString = date.toDateString();
    try {
      const loadedNotes = await firestore.loadNotes(companyId, dateString);
      setNotes(prevNotes => ({
        ...prevNotes,
        [dateString]: loadedNotes,
      }));
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleNoteSubmit = async () => {
    const dateString = selectedDate.toDateString();
    const currentNotes = notes[dateString] || [];

    if (currentNotes.length >= 3) {
        alert('You can only add up to 3 notes per day.');
        return;
    }

    const newNotes = [...currentNotes, note];

    try {
        // Save to Firestore
        await firestore.saveNotes(companyId, dateString, newNotes);

        // Update state after saving to Firestore
        setNotes(prevNotes => ({
            ...prevNotes,
            [dateString]: newNotes,
        }));
        setNote('');
    } catch (error) {
        console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (date, noteIndex) => {
    const dateString = date.toDateString();
    const currentNotes = notes[dateString] || [];

    const updatedNotes = currentNotes.filter((_, index) => index !== noteIndex);

    try {
        // Update Firestore
        await firestore.saveNotes(companyId, dateString, updatedNotes);

        // Update state after deletion
        setNotes(prevNotes => ({
            ...prevNotes,
            [dateString]: updatedNotes,
        }));
    } catch (error) {
        console.error('Error deleting note:', error);
    }
  };

   // Show colored dots on dates with notes
  const tileContent = ({ date, view }) => {
    const dateString = date.toDateString();
    if (view === 'month' && notes[dateString] && notes[dateString].length > 0) {
      return <div className="dot" />;
    }
    return null;
  };

  return (
    <div className="calendar-dashboard">
      <Layout />
      <main className="calendar-main-content">
        <div className="calendar-main">
          <div className="calendar-header-page">
            <header>
              <h1>ปฏิทิน</h1>
            </header>
          </div>
          <div className="calendar-main-contain">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}  // Show colored dots on dates with notes
            />
            <div className="calendar-notes-section">
              <h2>Notes for {selectedDate.toDateString()}</h2>
                <ul>
                  {notes[selectedDate.toDateString()]?.map((note, index) => (
                    <li key={index} className="note-item">
                      <div className="note-content">
                        <span>{note}</span>
                        <button className="delete-button" onClick={() => handleDeleteNote(selectedDate, index)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <textarea
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="Add a note"
                />
              <button onClick={()=>handleNoteSubmit()}>Add Note</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  }
  
  export default CalendarPage;
