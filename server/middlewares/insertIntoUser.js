const sql = require('../dbConfig');

const insertIntoUser = async (req, res, next) => {
    const email = req.oidc.user.email;
    const nickname = req.oidc.user.nickname;

    try {
        const result = await sql`
        INSERT INTO "User" ("UserId", "Email", "UserName")
        VALUES (
            uuid_generate_v4(),
            ${email},
            ${nickname}
        )
        ON CONFLICT ("Email") DO NOTHING;
        `;
        next();
    } catch (err) {
        console.error('Insert Into User', err);
        res.status(500).send('Internal Server Error');
    }
  };
  
  module.exports = insertIntoUser;