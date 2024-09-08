import React, { useState } from 'react';
import './Contact.css';
import Layout from './Layout';
import emailjs from 'emailjs-com';
import { IoAttach } from "react-icons/io5";

function Contact() {
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [email, setEmail] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send form data using EmailJS
    emailjs.sendForm('service_di307hh', 'template_q69jogx', e.target, 'sT8ZIWDhLD1_zjzvb')
      .then((result) => {
        alert('Email successfully sent!');
        // Reset form fields
        setName('');
        setDetail('');
        setEmail('');
        setAttachments([]);
      }, (error) => {
        alert('Failed to send email. Please try again.');
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      alert('You can only attach up to 5 images.');
      return;
    }
    setAttachments(Array.from(e.target.files));
  };

  return (
    <div className="dashboard">
      <Layout />
      <main className="main-content">
        <div className="contact-page">
          <div className="contact-container">
            <form className="contact-form" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="name">ชื่อ</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="detail">รายละเอียด</label>
                <textarea 
                  id="detail" 
                  name="detail" 
                  value={detail} 
                  onChange={(e) => setDetail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">อีเมล</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="attachments">แนบรูปภาพ (สูงสุด 5 รูป)</label>
                <input 
                  type="file" 
                  id="attachments" 
                  name="attachments" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                />
                <IoAttach size={24} />
              </div> */}
              <button type="submit" className="submit-button">ส่งข้อความ</button>
            </form>
            <div className="quote">
              <p>"Unlock HR with PAM"</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;
