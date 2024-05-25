const { Weather } = require('../models');
const weatherService = require('../services/weatherService');

exports.saveWeatherMapping = async (req, res) => {
  try {
    const weatherData = await weatherService.fetchAndSaveWeatherData(req.body);
    res.status(201).json(weatherData);
  } catch (error) {
    console.error('Error saving weather data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.weatherDashboard = async (req, res) => {
  try {
    const city = req.query.city;
    const weatherData = await weatherService.getWeatherData(city);
    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.mailWeatherData = async (req, res) => {
  try {
    await weatherService.sendWeatherEmail(req.body);
    res.status(200).json({ message: 'Weather data emailed successfully' });
  } catch (error) {
    console.error('Error sending weather email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
