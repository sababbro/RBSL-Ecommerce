const { Client } = require('pg');

const connectionString = 'postgresql://postgres.alxvnuylaooblulitvzm:dxF1E1T3q7ebCJV@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function test() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { reflect: true, rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase (ignoring self-signed)...');
    await client.connect();
    console.log('Successfully connected!');
    const res = await client.query('SELECT current_user, version();');
    console.log('User info:', res.rows[0]);
  } catch (err) {
    console.error('Connection failed:', err.stack);
  } finally {
    process.exit(0);
  }
}

test();
