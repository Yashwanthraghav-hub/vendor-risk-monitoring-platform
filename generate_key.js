const { execSync } = require('child_process');
try {
  execSync('ssh-keygen -t rsa -b 2048 -N "" -f temp_key', { stdio: 'inherit' });
  console.log('✅ Temporary SSH key generated successfully.');
} catch (error) {
  console.error('❌ Failed to generate SSH key:', error.message);
  process.exit(1);
}
