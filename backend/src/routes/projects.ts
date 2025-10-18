import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Join a project
router.post('/:id/join', authenticateToken, async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const userId = (req as any).user.userId;

    // Check if project exists
    const projectCheck = await pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectCheck.rows[0];

    // Check if user is already a participant
    if (project.participants && project.participants.includes(userId)) {
      return res.status(400).json({ error: 'You are already participating in this project' });
    }

    // Add user to participants array
    const result = await pool.query(
      `UPDATE projects 
       SET participants = array_append(COALESCE(participants, ARRAY[]::UUID[]), $1::UUID),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [userId, projectId]
    );

    res.json({
      message: 'Successfully joined the project',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Join project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leave a project
router.post('/:id/leave', authenticateToken, async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const userId = (req as any).user.userId;

    // Remove user from participants array
    const result = await pool.query(
      `UPDATE projects 
       SET participants = array_remove(participants, $1::UUID),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [userId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Successfully left the project',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Leave project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get projects for current user
router.get('/my-projects', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const result = await pool.query(
      `SELECT * FROM projects 
       WHERE $1 = ANY(participants) OR author_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
