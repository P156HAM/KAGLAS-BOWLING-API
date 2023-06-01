const { uuid } = require('uuidv4');
const { createDbConnection } = require('../db');
const { start } = require('repl');
const db = createDbConnection()

// Insert the new booking function
function insertNewBooking(date, email, time, bowlers, lanes, shoeSize) {
        const totalPrice = calculatePrice(bowlers, lanes);
        const bookingId = uuid();
    
    // Check lane availability
    return checkLaneAvailability(date, time, lanes, bookingId)
    .then(() => {
        // Insert the new booking to the database
        const insertQuery = `INSERT INTO bookings (date, email, time, bowlers, lanes, shoeSize, price, bookingId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(insertQuery, [date, email, time, bowlers, lanes, JSON.stringify(shoeSize), totalPrice, bookingId], (error) => {
        if (error) {
            reject(new Error(error.message));
            return;
        }
        });
    })
    .catch(error => {
        console.log(error.message)
        throw new Error('Not enough available lanes at the specified date and time.')
    })
                   
};

// Check lane availability function
function checkLaneAvailability(date, time, lanes, bookingId) {
    return new Promise((resolve, reject) => {
      const availabilityQuery = 'SELECT SUM(lanes) AS bookedLanesCount FROM bookings WHERE date = ? AND time = ? AND bookingId <> ?';
      db.get(availabilityQuery, [date, time, bookingId], (error, row) => {
        if (error) {
          reject(new Error(error.message));
          return;
        }
  
        const bookedLanesCount = row.bookedLanesCount || 0;
        const availableLanes = 8 - bookedLanesCount;
  
        if (lanes > availableLanes) {
          reject(new Error('Not enough available lanes at the specified date and time.'));
          return;
        }
  
        resolve();
      });
    });
}

// calculate the total price
function calculatePrice(bowlers, lanes) {
    const personPrice = 120;
    const lanePrice = 100;
    const totalPersonPrice = personPrice * bowlers;
    const totalLanePrice = lanePrice * lanes;
    const totalPrice = totalLanePrice + totalPersonPrice;

    return totalPrice
}

// modifing a booking function
function modifyBooking(date, email, time, bowlers, lanes, shoeSize, bookingId) {
    const totalPrice = calculatePrice(bowlers, lanes);
  
    return new Promise((resolve, reject) => {
      checkLaneAvailability(date, time, lanes, bookingId)
        .then(() => {
          // Check if the booking exists
          const selectQuery = 'SELECT * FROM bookings WHERE bookingId = ?';
          db.get(selectQuery, [bookingId], (error, row) => {
            if (error) {
              reject(new Error(error.message));
              return;
            }
  
            if (!row) {
              reject(new Error('Booking not found.'));
              return;
            }
  
            // Update the booking in the database
            const updateQuery = 'UPDATE bookings SET date = ?, email = ?, time = ?, bowlers = ?, lanes = ?, shoeSize = ?, price = ? WHERE bookingId = ?';
            db.run(updateQuery, [date, email, time, bowlers, lanes, JSON.stringify(shoeSize), totalPrice, bookingId], (error) => {
              if (error) {
                reject(new Error(error.message));
                return;
              }
              resolve();
            });
          });
        })
        .catch(error => {
          reject(new Error('Not enough available lanes at the specified date and time.'));
        });
    });
}

//delete a booking function
function removeBookingWithId(bookingId) {
    const selectQuery = `DELETE FROM bookings WHERE bookingId = ?`
    return new Promise((resolve, reject) => {
        db.run(selectQuery, [bookingId], (error, row) => {
            if(error) {
                reject(new Error(error.message))
                return;
            } else {
                resolve(row)
            }
        })
    })
}

function findBookingById(bookingId) {
    const selectQuery = `SELECT * FROM bookings WHERE bookingId = ?`
    return new Promise((resolve, reject) => {
        db.get(selectQuery, [bookingId], (error, row) => {
            if(error) {
                reject(new Error(error.message))
                return;
            } else {
                resolve(row)
            }
        })
    })
}

//search bookings by date
function searchBookingByDateRange(startDate, endDate) {
    return new Promise((resolve, reject) => {
        const searchQuery = `SELECT date, email, time, bowlers, lanes, shoeSize, price, bookingId
                            FROM bookings
                            WHERE date >= ? AND date <= ?
                            ORDER BY date, time`
        
        db.all(searchQuery, [startDate, endDate], (error, row) => {
            if(error) {
                reject(new Error(error.message))
                return;
            }

            resolve(row)
        })
    })
}

module.exports = { insertNewBooking, modifyBooking, removeBookingWithId, findBookingById, searchBookingByDateRange };