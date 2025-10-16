import { pool } from './config/database';

async function testConnection() {
  try {
    console.log('🔄 Testing PostgreSQL connection...\n');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Connection successful!\n');
    
    // Test database query
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('📊 Database Information:');
    console.log('   Version:', result.rows[0].version.split(' ').slice(0, 2).join(' '));
    console.log('   Database:', result.rows[0].current_database);
    console.log('   User:', result.rows[0].current_user);
    console.log();
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('📋 Existing Tables:');
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found. Run "npm run migrate" to create the schema.');
    }
    
    client.release();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your DATABASE_URL in .env file');
    console.log('   2. Ensure you replaced [YOUR-PASSWORD] with your actual Supabase password');
    console.log('   3. Verify your Supabase project is active');
    console.log('   4. Check your internet connection');
    process.exit(1);
  }
}

testConnection();
