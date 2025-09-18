import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function debugNeonConnection() {
    console.log('=== Debugging Neon Serverless Connection ===\n');
    
    const originalUrl = process.env.DATABASE_URL;
    console.log('Original DATABASE_URL:', originalUrl);
    console.log('');
    
    // Test different URL formats
    const testUrls = [
        // Original URL
        originalUrl,
        // Without extra parameters
        'postgresql://postgres.nimcmeqcdinuuuqzaoin:u6fC%3F%26g8hJA2cD%3F@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
        // Direct connection
        'postgresql://postgres:u6fC%3F%26g8hJA2cD%3F@db.nimcmeqcdinuuuqzaoin.supabase.co:5432/postgres',
        // With SSL mode only
        'postgresql://postgres.nimcmeqcdinuuuqzaoin:u6fC%3F%26g8hJA2cD%3F@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require'
    ];
    
    for (const [index, url] of testUrls.entries()) {
        console.log(`\n--- Testing URL ${index + 1} ---`);
        console.log(`URL: ${url?.substring(0, 50)}...`);
        
        if (!url) {
            console.log('❌ URL is null/undefined');
            continue;
        }
        
        try {
            // Create neon instance
            console.log('Creating neon instance...');
            const sql = neon(url, {
                connectionTimeoutMillis: 10000,
                arrayMode: false,
                fullResults: false,
            });
            
            console.log('✅ Neon instance created successfully');
            
            // Test query
            console.log('Testing query...');
            const result = await sql`SELECT 1 as test_connection, current_database() as database_name`;
            console.log('✅ Query successful:', result);
            
            // Test table query
            console.log('Testing users table query...');
            const usersResult = await sql`SELECT COUNT(*) as user_count FROM users`;
            console.log('✅ Users table query successful:', usersResult);
            
            console.log('🎉 Connection working! Using this URL format.');
            break;
            
        } catch (error) {
            console.log('❌ Connection failed:', error.message);
            
            // Check for specific error types
            if (error.message.includes('ENOTFOUND')) {
                console.log('   → DNS resolution error - hostname not found');
            } else if (error.message.includes('ETIMEDOUT')) {
                console.log('   → Connection timeout - check network/firewall');
            } else if (error.message.includes('authentication')) {
                console.log('   → Authentication error - check credentials');
            } else if (error.message.includes('fetch failed')) {
                console.log('   → Fetch error - likely network connectivity issue');
                console.log('   → Full error:', error.cause?.message || 'Unknown cause');
            }
        }
    }
    
    console.log('\n=== Connection Debug Complete ===');
}

debugNeonConnection().catch(console.error);