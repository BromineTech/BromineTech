const sql = require('../dbConfig');

const getDbId = async (req, res, next) => {
    const { projectUrlId, issueUrlId = null } = req.params;

    try {
        const projectIdResult = await sql`
        SELECT "dbId" FROM "DNS"
        WHERE "url" = ${projectUrlId}
        `;

        if (!projectIdResult || projectIdResult.length === 0) {
            return res.status(404).send('Project not found');
        }

        req.projectId = projectIdResult[0].dbId;

        if (issueUrlId) {
            const issueIdResult = await sql`
            SELECT "dbId" FROM "DNS"
            WHERE "url" = ${issueUrlId}
            `;

            if (!issueIdResult || issueIdResult.length === 0) {
                return res.status(404).send('Issue not found');
            }

            req.issueId = issueIdResult[0].dbId;
        }

        next();
    } catch (err) {
        console.error('get DB Id middleware', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = getDbId;
