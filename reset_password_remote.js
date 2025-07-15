const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function resetPassword() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@postgres:5432/postgres',
  });

  try {
    const email = 'nico_baburek@hotmail.com';
    const newPassword = 'NicoNico!!Babsbam34';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Generated hash:', hashedPassword);
    
    // Update the user's password
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email',
      [hashedPassword, email]
    );
    
    if (result.rows.length === 0) {
      console.log('User not found. Creating new user...');
      const insertResult = await pool.query(
        'INSERT INTO users (email, password_hash, role, status) VALUES ($1, $2, $3, $4) RETURNING id, email',
        [email, hashedPassword, 'admin', 'approved']
      );
      console.log('New user created:', insertResult.rows[0]);
    } else {
      console.log('Password updated for user:', result.rows[0]);
    }
    
    console.log('Password reset completed successfully!');
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await pool.end();
  }
}

resetPassword(); 