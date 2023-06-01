const sqlite3 = require('sqlite3').verbose()
const path = './database.db'

function createDbConnection() {
    const db = new sqlite3.Database(path, (error) => {
        if(error) return console.log(error.message)
        createTables(db)
    })
    return db
}

function createTables(db) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            email VARCHAR(100) NOT NULL,
            time VARCHAR(5) NOT NULL,
            bowlers INTEGER NOT NULL,
            lanes INTEGER NOT NULL,
            shoeSize VARCHAR(10) NOT NULL,
            price DECIMAL(5, 1) NOT NULL,
            bookingId INTEGER NOT NULL
        )`
    )
}

module.exports = { createDbConnection }