const Joi = require('joi');

function validateBookingInfo(req, res, next) {
  // Define validation schema
  const schema = Joi.object({
    date: Joi.date().iso().min('now').required(),
    email: Joi.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
    time: Joi.string().regex(/^\d{2}:(00|30)$/).required(),
    bowlers: Joi.number().integer().min(1).required(),
    lanes: Joi.number().integer().min(1).max(8).required(),
    shoeSize: Joi.object().pattern(/.*/, Joi.string().required()).min(Joi.ref('bowlers')).required(),
  });

  // Validate input data
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
        error: error.details[0].message
    });
  }

  next();
}

module.exports = { validateBookingInfo };