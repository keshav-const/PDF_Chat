import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    
    if (!process.env.DATABASE_URL) {
        console.log('❌ DATABASE_URL is not set');
        return;
    }
    
    // Test different connection URLs
    const urls = [
        // Direct connection
        `postgresql://postgres:${encodeURIComponent('u6fC?&g8hJA2cD?')}@db.nimcmeqcdinuuuqzaoin.supabase.co:5432/postgres`,
        // Pooler connection
        `postgresql://postgres.nimcmeqcdinuuuqzaoin:${encodeURIComponent('u6fC?&g8hJA2cD?')}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres`,
        // Alternative format
        `postgresql://postgres.nimcmeqcdinuuuqzaoin:${encodeURIComponent('u6fC?&g8hJA2cD?')}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require`
    ];
    
    for (const [index, url] of urls.entries()) {
        console.log(`\nTesting connection ${index + 1}...`);
        try {
            const sql = neon(url, {
                connectionTimeoutMillis: 10000,
            });
            
            const result = await sql`SELECT 1 as test`;
            console.log(`✅ Connection ${index + 1} successful:`, result);
            
            // Test creating a simple table
            try {
                await sql`CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT)`;
                console.log(`✅ Table creation successful for connection ${index + 1}`);
            } catch (tableError) {
                console.log(`❌ Table creation failed for connection ${index + 1}:`, tableError.message);
            }
            
            return; // Success, exit
        } catch (error) {
            console.log(`❌ Connection ${index + 1} failed:`, error.message);
        }
    }
    
    console.log('\n❌ All connection attempts failed');
}

testConnection().catch(console.error);