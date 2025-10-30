import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all events
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM events 
       ORDER BY start_date ASC`
    );

    res.json({ events: result.rows });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join an event
router.post('/:id/join', authenticateToken, async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const userId = (req as any).user.id;

    // Check if event exists
    const eventCheck = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventCheck.rows[0];

    // Check if user is already attending
    if (event.attendees && event.attendees.includes(userId)) {
      return res.status(400).json({ error: 'You are already attending this event' });
    }

    // Check max attendees limit
    if (event.max_attendees && event.attendees && event.attendees.length >= event.max_attendees) {
      return res.status(400).json({ error: 'Event is full' });
    }

    // Add user to attendees array
    const result = await pool.query(
      `UPDATE events 
       SET attendees = array_append(COALESCE(attendees, ARRAY[]::UUID[]), $1::UUID),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [userId, eventId]
    );

    res.json({
      message: 'Successfully joined the event',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leave an event
router.post('/:id/leave', authenticateToken, async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const userId = (req as any).user.id;

    // Remove user from attendees array
    const result = await pool.query(
      `UPDATE events 
       SET attendees = array_remove(attendees, $1::UUID),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [userId, eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Successfully left the event',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get events for current user
router.get('/my-events', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    console.log('🔍 Fetching events for user:', userId);

    const result = await pool.query(
      `SELECT * FROM events 
       WHERE $1::TEXT = ANY(SELECT unnest(attendees)::TEXT) OR organizer_id::TEXT = $1::TEXT
       ORDER BY start_date DESC`,
      [userId]
    );

    console.log(`📊 Found ${result.rows.length} events for user ${userId}`);

    res.json({ events: result.rows });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
