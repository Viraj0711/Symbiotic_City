import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('🔄 Running database migrations...');
    
    const migrationFile = path.join(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf-8');
    
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Database schema has been initialized.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
