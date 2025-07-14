const bcrypt = require('bcryptjs');

const password = 'NicoNico!!Babsbam34';
const storedHash = '$2b$10$D.LgiFrjkNFSy.5iIcRfAOR2OFNu93uJdVAgpRftu9sfxLgOtqE3G';

bcrypt.compare(password, storedHash).then(result => {
  console.log('Password match:', result);
  if (result) {
    console.log('✅ Password verification successful!');
  } else {
    console.log('❌ Password verification failed!');
  }
}); 