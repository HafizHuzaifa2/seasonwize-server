const oracledb = require('oracledb');

async function connect() {
    return await oracledb.getConnection({
        user: 'huzaifa_24SP_011_SE',
        password: '4892432Huzu',
        connectString: 'localhost:1521/ORCLPDB'
    });
}

module.exports = {
    execute: async (sql, params = []) => {
        const conn = await connect();
        try {
            const result = await conn.execute(sql, params, { autoCommit: true });
            return result;
        } finally {
            await conn.close();
        }
    }
};


