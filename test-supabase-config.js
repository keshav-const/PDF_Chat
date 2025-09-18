import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function testSupabaseConfig() {
    console.log('=== Supabase Configuration Test ===\n');
    
    // Check environment variables
    console.log('Environment Variables:');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);
    console.log('SUPABASE_ANON_KEY length:', process.env.SUPABASE_ANON_KEY?.length);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('');
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.log('❌ Missing Supabase credentials');
        return;
    }
    
    try {
        // Create Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );
        
        console.log('✅ Supabase client created successfully');
        
        // Test basic connection
        console.log('\nTesting basic connection...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
            console.log('❌ Auth session error:', error.message);
        } else {
            console.log('✅ Auth connection successful');
        }
        
        // Test database connection with a simple query
        console.log('\nTesting database connection...');
        const { data: dbData, error: dbError } = await supabase
            .from('users') // Try to query users table
            .select('count')
            .limit(1);
            
        if (dbError) {
            console.log('⚠️  Database query error:', dbError.message);
            console.log('Error details:', dbError);
            
            // Check if it's a table doesn't exist error
            if (dbError.message.includes('relation "users" does not exist')) {
                console.log('💡 This suggests the database tables haven\'t been created yet');
            }
        } else {
            console.log('✅ Database query successful:', dbData);
        }
        
        // Test storage bucket access
        console.log('\nTesting storage access...');
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
        
        if (storageError) {
            console.log('⚠️  Storage access error:', storageError.message);
        } else {
            console.log('✅ Storage access successful. Buckets:', buckets?.map(b => b.name));
        }
        
        // Generate the correct DATABASE_URL based on project
        const projectRef = process.env.SUPABASE_URL.split('://')[1].split('.')[0];
        console.log('\nProject Reference:', projectRef);
        console.log('Expected DATABASE_URL formats:');
        console.log('Direct:', `postgresql://postgres:[PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`);
        console.log('Pooler:', `postgresql://postgres.${projectRef}:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres`);
        
    } catch (error) {
        console.log('❌ Supabase client error:', error.message);
        console.log('Full error:', error);
    }
}

testSupabaseConfig().catch(console.error);