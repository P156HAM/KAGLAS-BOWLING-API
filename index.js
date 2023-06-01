const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000

const { bookingRouter } = require('./routes/bookings.route')
const { createDbConnection } = require('./db')

app.use(express.json())

app.use('/api/bookings', bookingRouter)

createDbConnection()

app.listen(PORT, ()=> {
    console.log("listning on: " + PORT)
})