const bcrypt = require('bcrypt');

async function generate() {
    const password1 = '9609Huzu';
    const password2 = 'faadi123';

    const hash1 = await bcrypt.hash(password1, 10);
    const hash2 = await bcrypt.hash(password2, 10);

    console.log(`
INSERT INTO sw_users (username, password_hash,role) VALUES ('Huzaifa', '${hash1}','admin');
INSERT INTO sw_users (username, password_hash,role) VALUES ('Fahad', '${hash2}','admin');
`);
}

generate();
