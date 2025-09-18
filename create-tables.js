import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function createTables() {
    console.log('Creating database tables...\n');
    
    // SQL to create all tables based on schema.ts
    const createTablesSQL = `
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create files table
    CREATE TABLE IF NOT EXISTS files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create conversations table
    CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        file_id UUID REFERENCES files(id),
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create messages table
    CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id),
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
    `;
    
    try {
        // Execute SQL using Supabase client
        const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: createTablesSQL 
        });
        
        if (error) {
            console.log('❌ Error creating tables with RPC:', error.message);
            console.log('Trying alternative method...\n');
            
            // Alternative: Use individual queries
            const queries = [
                'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
                `CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`,
                `CREATE TABLE IF NOT EXISTS files (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id),
                    file_name TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    file_size TEXT NOT NULL,
                    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`,
                `CREATE TABLE IF NOT EXISTS conversations (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id),
                    file_id UUID REFERENCES files(id),
                    title TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`,
                `CREATE TABLE IF NOT EXISTS messages (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    conversation_id UUID NOT NULL REFERENCES conversations(id),
                    sender TEXT NOT NULL,
                    content TEXT NOT NULL,
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
            ];
            
            for (const query of queries) {
                try {
                    console.log('Executing:', query.substring(0, 50) + '...');
                    const { error: queryError } = await supabase.rpc('exec_sql', { 
                        sql_query: query 
                    });
                    
                    if (queryError) {
                        console.log('❌ Query failed:', queryError.message);
                    } else {
                        console.log('✅ Query successful');
                    }
                } catch (queryErr) {
                    console.log('❌ Query execution error:', queryErr.message);
                }
            }
        } else {
            console.log('✅ Tables created successfully!');
        }
        
        // Test if tables were created by querying them
        console.log('\nTesting table creation...');
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (userError) {
            console.log('❌ Users table test failed:', userError.message);
        } else {
            console.log('✅ Users table accessible');
        }
        
        const { data: filesData, error: filesError } = await supabase
            .from('files')
            .select('count')
            .limit(1);
            
        if (filesError) {
            console.log('❌ Files table test failed:', filesError.message);
        } else {
            console.log('✅ Files table accessible');
        }
        
    } catch (error) {
        console.log('❌ Unexpected error:', error.message);
        console.log('\n💡 You may need to create the tables manually in the Supabase dashboard:');
        console.log('1. Go to https://supabase.com/dashboard/project/nimcmeqcdinuuuqzaoin');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Run the SQL queries above');
    }
}

createTables().catch(console.error);