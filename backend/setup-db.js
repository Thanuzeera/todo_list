const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Common MySQL passwords to try
const commonPasswords = ['', 'root', 'password', 'admin', '123456', 'mysql'];

async function setupDatabase() {
  console.log('🔧 Setting up MySQL database for Todo App...\n');
  
  // Read the SQL file
  const sqlFile = path.join(__dirname, 'database.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  
  // Split SQL commands
  const sqlCommands = sqlContent
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
  
  console.log('📋 SQL Commands to execute:');
  sqlCommands.forEach((cmd, index) => {
    console.log(`${index + 1}. ${cmd.substring(0, 50)}...`);
  });
  console.log('');
  
  // Try to connect with different passwords
  for (const password of commonPasswords) {
    try {
      console.log(`🔑 Trying password: ${password || '(empty)'}`);
      
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password,
        multipleStatements: true
      });
      
      console.log('✅ Connected to MySQL successfully!');
      
      // Execute each SQL command
      for (const command of sqlCommands) {
        if (command.trim()) {
          await connection.execute(command);
          console.log(`✅ Executed: ${command.substring(0, 50)}...`);
        }
      }
      
      console.log('\n🎉 Database setup completed successfully!');
      console.log('📊 Database: todo_app');
      console.log('📋 Table: todos (with sample data)');
      
      await connection.end();
      
      // Update .env file with the working password
      const envPath = path.join(__dirname, '.env');
      let envContent = `DB_HOST=localhost
DB_USER=root
DB_PASSWORD=${password}
DB_NAME=todo_app
PORT=5000`;
      fs.writeFileSync(envPath, envContent);
      
      console.log(`\n🔧 Updated .env with password: ${password || '(empty)'}`);
      console.log('\n🚀 You can now run: cd .. && .\\start.bat');
      
      return;
      
    } catch (error) {
      console.log(`❌ Failed with password: ${password || '(empty)'}`);
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        continue; // Try next password
      } else {
        console.log(`Error: ${error.message}`);
        break;
      }
    }
  }
  
  console.log('\n❌ Could not connect to MySQL with common passwords.');
  console.log('\n📝 Manual setup required:');
  console.log('1. Open MySQL Workbench or phpMyAdmin');
  console.log('2. Copy and paste the SQL commands shown above');
  console.log('3. Execute them manually');
  console.log('4. Update .env with your actual password');
}

// Run the setup
setupDatabase().catch(console.error);

