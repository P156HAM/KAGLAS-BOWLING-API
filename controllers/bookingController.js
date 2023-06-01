const { insertNewBooking, modifyBooking, removeBookingWithId, findBookingById, searchBookingByDateRange } = require('../models/bookings.model')

function createBooking(req, res) {
    const { date, email, time, bowlers, lanes, shoeSize } = req.body;
  
    insertNewBooking(date, email, time, bowlers, lanes, shoeSize)
        .then(() => {
            res.status(201).json({ message: 'Booking created successfully' });
        })
        .catch((error) => {
            console.error(error); // Log the error for debugging purposes
            res.status(400).json({ error: error.message });
        });
}

function updatebooking(req, res) {
    const { date, email, time, bowlers, lanes, shoeSize } = req.body;
    const bookingId = req.params.bookingId
    modifyBooking(date, email, time, bowlers, lanes, shoeSize, bookingId)
    .then(() => {
        res.status(201).json({ message: 'Booking updated successfully', })
    })
    .catch((error) => {
        console.error(error); // Log the error for debugging purposes
        res.status(400).json({ error: error.message });
    })
}

function deleteBooking(req, res) {
    const bookingId = req.params.bookingId
    removeBookingWithId(bookingId)
    .then(() => {
        res.status(201).json({ message: 'Booking successfully deleted'})
    })
    .catch((error) => {
        res.status(400).json({ error: error.message})
    })
}

async function findBooking(req, res) {
    const bookingId = req.params.bookingId
    try {
        const bookingDetails = await findBookingById(bookingId)
        res.status(201).json({ success: true, booking: bookingDetails})
    } 
    catch (error) {
        res.status(400).json({ success: false, msg: 'Booking not found'})
    }
    
}

function findBookingsByDateRange(req, res) {
    const { startDate, endDate } = req.body
    searchBookingByDateRange(startDate, endDate)
    .then((results) => {
        res.status(201).json({ success: true, bookings: results })
    })
    .catch(error => {
        res.status(400).json({ success: false, msg: error.message })
    })
}

module.exports = { createBooking, updatebooking, deleteBooking, findBooking, findBookingsByDateRange };