import React, { useState } from "react";
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const templateParams = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    };

    try {
      await emailjs.send(
        'service_wd96yn7',
        'template_nf4nfqf',
        templateParams,
        'rrAj6yu30QQuLurg4'
      );
      
      setSuccess(true);
      e.target.reset();
      
      setTimeout(() => {
        setSuccess(false);
      }, 10000);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact">
      <h2>Let's Connect</h2>
      <p>
        Visit us at 123 Corniche Street, Beirut, Lebanon, or drop us a message
        below.
      </p>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" rows="4" required></textarea>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {success && (
        <div style={{
          backgroundColor: '#e8f5e9',
          borderLeft: '4px solid #4caf50',
          padding: '1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          color: '#2e7d32'
        }}>
          <strong>Success!</strong> Your message has been sent!
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          borderLeft: '4px solid #e53935',
          padding: '1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          color: '#c62828'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="opening-hours">
        <h3>Opening Hours</h3>
        <p>Mon–Fri: 8am – 6pm</p>
        <p>Sat–Sun: 9am – 4pm</p>
      </div>
    </div>
  );
};

export default Contact;