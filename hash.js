const bcrypt = require('bcryptjs');

const password = 'NicoNico!!Babsbam34';
bcrypt.hash(password, 10).then(hash => {
  console.log(hash);
}); 