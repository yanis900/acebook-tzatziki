const bcrypt = require("bcrypt");

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
}

module.exports = { hashPassword };

