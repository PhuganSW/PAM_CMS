import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from './Layout';
import './Home.css';
import './Calendar.css'; // Create and import your CSS for custom styles

const CLIENT_ID = '869699175876-mqt0r0crshde3ij7lt61krmcq8oipr1n.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCKgVX5urTZGB-bYs0bhUn94E3DgYnEOZ8';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function CalendarPage() {
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
          gapi.auth2.getAuthInstance().signIn().then(() => {
            loadCalendarEvents();
          });
        });
      }
      gapi.load('client:auth2', start);
    }, []);
  
    const loadCalendarEvents = () => {
      gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      }).then(response => {
        const events = response.result.items;
        setEvents(events);
      });
    };
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    const handleNoteChange = (e) => {
      setNote(e.target.value);
    };
  
    const handleNoteSubmit = () => {
      const dateString = selectedDate.toDateString();
      setNotes(prevNotes => {
        const updatedNotes = { ...prevNotes };
        if (!updatedNotes[dateString]) {
          updatedNotes[dateString] = [];
        }
        if (updatedNotes[dateString].length < 3) {
          updatedNotes[dateString].push(note);
          setNote('');
        } else {
          alert('You can only add up to 3 notes per day.');
        }
        return updatedNotes;
      });
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
              />
              <div className="calendar-notes-section">
                <h2>Notes for {selectedDate.toDateString()}</h2>
                <ul>
                  {notes[selectedDate.toDateString()]?.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
                <textarea
                  value={note}
                  onChange={handleNoteChange}
                  placeholder="Add a note"
                />
                <button onClick={handleNoteSubmit}>Add Note</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  export default CalendarPage;
