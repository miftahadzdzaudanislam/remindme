const router = require('express').Router();
const { google } = require('googleapis');
const express = require('express');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.get('/', async (req, res) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-token', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    return res.json(tokens);
  } catch (error) {
    console.error('Failed to exchange code for token:', error.response?.data || error.message, error);
    return res.status(400).json({ error: 'Invalid code or exchange failed', details: error.response?.data });
  }
});

// Create Event Google Calendar
router.post('/create-event', async (req, res) => {
  try {
    const { summary, description, location, startDate, endDate, refresh_token, recurrence } = req.body;

    oauth2Client.setCredentials({
      refresh_token: refresh_token || process.env.GOOGLE_REFRESH_TOKEN,
    });
    await oauth2Client.getAccessToken();

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary,
      location,
      description,
      start: {
        dateTime: startDate,
        timeZone: 'Asia/Jakarta',
      },
      end: {
        dateTime: endDate,
        timeZone: 'Asia/Jakarta',
      },
      recurrence: Array.isArray(recurrence) ? recurrence : [],
      colorId: '6',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 },
          { method: 'email', minutes: 10 }
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    res.status(200).json({ success: true, data: response.data });
    // res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update Event Google Calendar
router.put('/update-event', async (req, res) => {
  try {
    const { eventId, summary, description, location, startDate, endDate, refresh_token, recurrence } = req.body;
    if (!refresh_token || !eventId) return res.status(400).json({ error: 'refresh_token and eventId required' });

    oauth2Client.setCredentials({ refresh_token });
    await oauth2Client.getAccessToken();

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary,
      description,
      location,
      start: { 
        dateTime: startDate,
        timeZone: 'Asia/Jakarta' 
      },
      end: { 
        dateTime: endDate, 
        timeZone: 'Asia/Jakarta' 
      },
      recurrence,
      colorId: '6',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 },
          { method: 'email', minutes: 10 }
        ],
      },
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      requestBody: event,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error updating event:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to update event', details: error.response?.data || error.message });
  }
});

// DELETE event Google Calendar
router.delete('/delete-event', async (req, res) => {
  try {
    const { eventId, refresh_token } = req.body;
    if (!eventId || !refresh_token) {
      return res.status(400).json({ error: 'eventId and refresh_token are required' });
    }

    oauth2Client.setCredentials({ refresh_token });
    await oauth2Client.getAccessToken();

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});


module.exports = router;