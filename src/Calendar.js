import React, { useEffect, useState, useContext } from 'react';
import { gapi } from 'gapi-script';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from './Layout';
import './Home.css';
import './Calendar.css'; // Create and import your CSS for custom styles
import firestore from './Firebase/Firestore';
import { UserContext } from './UserContext';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CLIENT_ID = '869699175876-mqt0r0crshde3ij7lt61krmcq8oipr1n.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCKgVX5urTZGB-bYs0bhUn94E3DgYnEOZ8';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function CalendarPage() {
  const { companyId } = useContext(UserContext);
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noteInputs, setNoteInputs] = useState(['', '', '', '']); // Array for up to 4 notes
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState('en'); // State to control language (default to English)

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
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

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    const dateString = date.toDateString();

    try {
      const loadedNotes = await firestore.loadNotes(companyId, dateString);
      const loadedNotesPadded = [...loadedNotes, '', '', '', ''].slice(0, 4); // Ensure we have exactly 4 slots
      setNoteInputs(loadedNotesPadded);
      setShowModal(true); // Open modal for the selected date
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...noteInputs];
    updatedNotes[index] = value;
    setNoteInputs(updatedNotes);
  };

  const handleNoteSubmit = async () => {
    const dateString = selectedDate.toDateString();
    const filteredNotes = noteInputs.filter((note) => note.trim() !== '');

    try {
      await firestore.saveNotes(companyId, dateString, filteredNotes);
      setNotes((prevNotes) => ({
        ...prevNotes,
        [dateString]: filteredNotes,
      }));
      setShowModal(false); // Close modal after saving
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowModal(false);
    setNoteInputs(['', '', '', '']);
  };

  // Display a dot on dates with notes
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
              <h1>ปฏิทินบันทึกโน้ต</h1>
            </header>
            {/* Language Toggle Buttons */}
            <div className="language-toggle">
              <Button
                variant="primary"
                onClick={() => setLanguage('th')}
                active={language === 'th'}
              >
                TH
              </Button>
              <Button
                variant="primary"
                onClick={() => setLanguage('en')}
                active={language === 'en'}
              >
                EN
              </Button>
            </div>
          </div>
          <div className="calendar-main-contain">
            <Calendar
              onClickDay={handleDateClick} // Open modal on date click
              value={selectedDate}
              tileContent={tileContent}
              locale={language} // Set the calendar language based on state
            />
          </div>
        </div>

        {/* Add Note Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedDate.toLocaleDateString(language, {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {noteInputs.map((note, index) => (
                <Form.Group key={index} controlId={`noteTextarea${index}`}>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={note}
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                    placeholder={`Note ${index + 1}`}
                    className="mb-2"
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleNoteSubmit} className="w-100">
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
}

export default CalendarPage;
