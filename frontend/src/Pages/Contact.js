import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      
      await axios.post(`${process.env.REACT_APP_API_URL}/contact`, formData);
      
      setSubmittedData(formData);
      setSuccess(true);
      
      e.target.reset();
      
      setTimeout(() => {
        setSuccess(false);
        setSubmittedData(null);
      }, 10000);
      
    } catch (err) {
      console.error('Error sending message:', err);
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
          <strong>Success!</strong> Thank you for contacting us! We've sent a confirmation email to {submittedData?.email}.
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

      {submittedData && success && (
        <div className="submitted-info">
          <h3>Your Submitted Information</h3>
          <table className="submitted-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td>{submittedData.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{submittedData.email}</td>
              </tr>
              <tr>
                <td>Message</td>
                <td>{submittedData.message}</td>
              </tr>
            </tbody>
          </table>
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