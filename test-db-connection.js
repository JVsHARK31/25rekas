// Test Database Connection Script
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Test different DATABASE_URL formats
const testUrls = [
  // Original
  'postgresql://postgres:Javier_310706@db.wchsoxntsnzurfpucplg.supabase.co:5432/postgres',
  // URL Encoded
  'postgresql://postgres:Javier%5F310706@db.wchsoxntsnzurfpucplg.supabase.co:5432/postgres',
  // With SSL
  'postgresql://postgres:Javier_310706@db.wchsoxntsnzurfpucplg.supabase.co:5432/postgres?sslmode=require'
];

async function testConnection(url, index) {
  try {
    console.log(`\n🔍 Testing URL ${index + 1}:`);
    console.log(url);
    
    const client = postgres(url, { max: 1 });
    const db = drizzle(client);
    
    // Simple test query
    const result = await client`SELECT 1 as test`;
    console.log('✅ Connection successful!');
    console.log('Test result:', result);
    
    await client.end();
    return true;
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing Database Connections...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const success = await testConnection(testUrls[i], i);
    if (success) {
      console.log(`\n✅ Use this URL for Vercel: ${testUrls[i]}`);
      break;
    }
  }
}

runTests().catch(console.error);