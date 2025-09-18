import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function testPgConnection() {
    console.log('=== Testing PostgreSQL Connection ===\n');
    
    const testUrls = [
        // Pooler connection
        'postgresql://postgres.nimcmeqcdinuuuqzaoin:u6fC%3F%26g8hJA2cD%3F@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
        // Direct connection
        'postgresql://postgres:u6fC%3F%26g8hJA2cD%3F@db.nimcmeqcdinuuuqzaoin.supabase.co:5432/postgres',
    ];
    
    for (const [index, connectionString] of testUrls.entries()) {
        console.log(`\n--- Testing URL ${index + 1} ---`);
        console.log(`URL: ${connectionString.substring(0, 50)}...`);
        
        const client = new Client({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 10000,
        });
        
        try {
            console.log('Connecting...');
            await client.connect();
            console.log('✅ Connected successfully');
            
            console.log('Testing query...');
            const result = await client.query('SELECT 1 as test, current_database() as db');
            console.log('✅ Query successful:', result.rows);
            
            console.log('Testing users table...');
            const usersResult = await client.query('SELECT COUNT(*) as user_count FROM users');
            console.log('✅ Users table query successful:', usersResult.rows);
            
            await client.end();
            console.log('🎉 PostgreSQL connection working!');
            return; // Success, exit
            
        } catch (error) {
            console.log('❌ Connection failed:', error.message);
            
            if (error.code === 'ENOTFOUND') {
                console.log('   → DNS resolution error');
            } else if (error.code === 'ETIMEDOUT') {
                console.log('   → Connection timeout');
            } else if (error.code === '28P01') {
                console.log('   → Authentication failed');
            }
            
            try {
                await client.end();
            } catch (e) {
                // Ignore cleanup errors
            }
        }
    }
    
    console.log('\n❌ All PostgreSQL connections failed');
    console.log('\n💡 Trying fallback to Supabase REST API...');
    
    // Test Supabase REST API as fallback
    try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?limit=1`, {
            headers: {
                'apikey': process.env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Supabase REST API working:', data);
            console.log('💡 We can use Supabase client instead of direct PostgreSQL connection');
        } else {
            console.log('❌ Supabase REST API failed:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('❌ Supabase REST API error:', error.message);
    }
}

testPgConnection().catch(console.error);