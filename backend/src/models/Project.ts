import { pool } from '../config/database';
import { IProject } from '../config/database';

export class Project {
  // Create a new project
  static async create(projectData: Partial<IProject>): Promise<IProject> {
    const query = `
      INSERT INTO projects (title, description, status, category, tags, author_id, participants, location, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      projectData.title,
      projectData.description,
      projectData.status || 'PLANNING',
      projectData.category,
      projectData.tags || [],
      projectData.author_id,
      projectData.participants || [],
      projectData.location ? JSON.stringify(projectData.location) : null,
      projectData.start_date || null,
      projectData.end_date || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find project by ID
  static async findById(id: string): Promise<IProject | null> {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find all projects with filters
  static async findAll(filters?: { 
    status?: string; 
    category?: string; 
    author_id?: string;
  }): Promise<IProject[]> {
    let query = 'SELECT * FROM projects WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      query += ` AND status = $${paramCount++}`;
      values.push(filters.status);
    }
    if (filters?.category) {
      query += ` AND category = $${paramCount++}`;
      values.push(filters.category);
    }
    if (filters?.author_id) {
      query += ` AND author_id = $${paramCount++}`;
      values.push(filters.author_id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Update project
  static async update(id: string, projectData: Partial<IProject>): Promise<IProject | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (projectData.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(projectData.title);
    }
    if (projectData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(projectData.description);
    }
    if (projectData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(projectData.status);
    }
    if (projectData.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(projectData.category);
    }
    if (projectData.tags !== undefined) {
      fields.push(`tags = $${paramCount++}`);
      values.push(projectData.tags);
    }
    if (projectData.participants !== undefined) {
      fields.push(`participants = $${paramCount++}`);
      values.push(projectData.participants);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE projects 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete project
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Add participant to project
  static async addParticipant(projectId: string, userId: string): Promise<IProject | null> {
    const query = `
      UPDATE projects 
      SET participants = array_append(participants, $1::uuid)
      WHERE id = $2 AND NOT ($1::uuid = ANY(participants))
      RETURNING *
    `;
    const result = await pool.query(query, [userId, projectId]);
    return result.rows[0] || null;
  }

  // Remove participant from project
  static async removeParticipant(projectId: string, userId: string): Promise<IProject | null> {
    const query = `
      UPDATE projects 
      SET participants = array_remove(participants, $1::uuid)
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [userId, projectId]);
    return result.rows[0] || null;
  }
}

export default Project;