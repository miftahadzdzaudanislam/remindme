import { Button } from '@/components/ui/button';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

// Komponen khusus untuk tombol login Google
function GoogleLoginButton({ setSignIn }) {
  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      console.log('Login Success:', codeResponse);
      const { code } = codeResponse;
      axios.post('http://localhost:4000/api/create-token', { code })
        .then(response => {
          console.log(response.data);
          setSignIn(true);
        })
        .catch(error => {
          console.error('Error creating token:', error?.response?.data || error.message);
          alert('Gagal login Google Calendar. Cek konsol untuk detail.');
        });
    },
    onError: error => {
      console.log('Login Failed:', error);
      alert('Login Google gagal.');
    },
    flow: 'auth-code',
    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
  });

  return (
    <Button onClick={() => login()}>
      Login with Google
    </Button>
  );
}

export default function Calendar() {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [signIn, setSignIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(summary, description, location, startDate, endDate);
    axios.post('http://localhost:4000/api/create-event', {
      summary,
      description,
      location,
      startDate,
      endDate
    })
      .then(response => {
        console.log('Event created:', response.data);
        alert('Event created successfully!');
        // Reset form fields
        setSummary('');
        setDescription('');
        setLocation('');
        setStartDate('');
        setEndDate('');
      })
      .catch(error => {
        console.error('Error creating event:', error?.response?.data || error.message);
        alert('Failed to create event. Check console for details.');
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <p className="text-gray-600">This is the calendar page.</p>
      {!signIn ? (
        <div>
          <GoogleOAuthProvider clientId="96639508355-2e44s4osqcutmdtau0mpknjghkq04eo5.apps.googleusercontent.com">
            <GoogleLoginButton setSignIn={setSignIn} />
          </GoogleOAuthProvider>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="summary">Summary</label>
            <input type="text" name="summary" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
            <br />

            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <br />

            <label htmlFor="location">Location</label>
            <input type="text" name="location" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <br />

            <label htmlFor="startDate">Start Date</label>
            <input type="datetime-local" name="startDate" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <br />

            <label htmlFor="endDate">End Date</label>
            <input type="datetime-local" name="endDate" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <br />

            <Button type='submit'>Create Event</Button>
          </form>
        </div>
      )}
    </div>
  );
}