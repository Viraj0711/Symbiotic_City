import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Database Configuration Check\n');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL is not set in .env file');
  process.exit(1);
}

console.log('✅ DATABASE_URL is set');
console.log('📝 Connection String Analysis:\n');

// Parse the connection string
try {
  const url = new URL(dbUrl);
  
  console.log('   Protocol:', url.protocol);
  console.log('   Username:', url.username);
  console.log('   Password:', url.password ? '***' + url.password.slice(-4) : 'NOT SET');
  console.log('   Host:', url.hostname);
  console.log('   Port:', url.port);
  console.log('   Database:', url.pathname.replace('/', ''));
  console.log('   SSL Required:', url.searchParams.get('sslmode') || 'default (yes for Supabase)');
  
  console.log('\n💡 Supabase Connection Options:');
  console.log('\n   Option 1: Direct Connection (what you\'re using)');
  console.log(`   ${url.protocol}//${url.username}:***@${url.hostname}:${url.port}${url.pathname}`);
  
  console.log('\n   Option 2: Connection Pooler (Transaction Mode) - Try this if direct fails');
  const poolerHost = url.hostname.replace('db.', '').replace('.supabase.co', '');
  console.log(`   postgresql://${url.username}:***@aws-0-us-east-1.pooler.supabase.com:6543/postgres`);
  
  console.log('\n   Option 3: Connection Pooler (Session Mode)');
  console.log(`   postgresql://${url.username}:***@aws-0-us-east-1.pooler.supabase.com:5432/postgres`);
  
  console.log('\n📋 Next Steps:');
  console.log('   1. Verify password is correct (no brackets, special chars properly escaped)');
  console.log('   2. Check Supabase dashboard: https://app.supabase.com/');
  console.log('   3. Ensure your project is active and not paused');
  console.log('   4. Try connection pooler URL if direct connection fails');
  console.log('   5. Check firewall/antivirus is not blocking port 5432');
  
} catch (error) {
  console.error('❌ Invalid DATABASE_URL format:', error);
  process.exit(1);
}
