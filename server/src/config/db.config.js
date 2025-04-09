const sql = require('mssql')
require('dotenv').config()

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 30000,
        requestTimeout: 30000,
        authentication: {
            type: 'default'
        }
    }
}

// Tạo pool connection
const pool = new sql.ConnectionPool(config)
const poolConnect = pool.connect()

// Hàm thực thi query
async function queryDatabase(query) {
    await poolConnect
    try {
        const request = pool.request()
        const result = await request.query(query)
        return result
    } catch (err) {
        console.error('SQL error', err)
        throw err
    }
}

module.exports = {
    config,
    queryDatabase
}