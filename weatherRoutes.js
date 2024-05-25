const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.post('/SaveWeatherMapping', weatherController.saveWeatherMapping);
router.get('/weatherDashboard', weatherController.weatherDashboard);
router.post('/mailWeatherData', weatherController.mailWeatherData);

module.exports = router;
