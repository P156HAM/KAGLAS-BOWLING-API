const { Router } = require('express');
const router = Router();

const { validateBookingInfo } = require('../middlewares/bookings.validate')
const { createBooking, updatebooking, deleteBooking, findBooking, findBookingsByDateRange } = require('../controllers/bookingController')

router.get('/:bookingId', findBooking)
router.post('/search', findBookingsByDateRange)
router.post('/', validateBookingInfo, createBooking)
router.put('/:bookingId', validateBookingInfo, updatebooking)
router.delete('/:bookingId', deleteBooking)

module.exports = {bookingRouter: router}