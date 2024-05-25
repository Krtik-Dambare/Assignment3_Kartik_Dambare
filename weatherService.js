const axios = require('axios');
const { Weather } = require('../models');
const nodemailer = require('nodemailer');

const GEOCODING_API_URL = 'https://api.api-ninjas.com/v1/geocoding';
const WEATHER_API_URL = 'https://rapidapi.p.rapidapi.com/weather';
const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

async function fetchAndSaveWeatherData(cities) {
  const weatherDataArray = [];

  for (const cityInfo of cities) {
    const geocodeResponse = await axios.get(GEOCODING_API_URL, {
      params: { city: cityInfo.city, country: cityInfo.country },
      headers: { 'X-Api-Key': GEOCODING_API_KEY },
    });

    const coordinates = geocodeResponse.data[0];
    const { latitude, longitude } = coordinates;

    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: { lat: latitude, lon: longitude },
      headers: { 'X-RapidAPI-Key': WEATHER_API_KEY },
    });

    const weather = weatherResponse.data.current.condition.text;
    const time = new Date();

    const weatherData = await Weather.create({
      city: cityInfo.city,
      country: cityInfo.country,
      weather,
      time,
      longitude,
      latitude,
    });

    weatherDataArray.push(weatherData);
  }

  return weatherDataArray;
}

async function getWeatherData(city) {
  if (city) {
    return await Weather.findAll({ where: { city } });
  } else {
    return await Weather.findAll({
      group: ['city'],
      attributes: [
        'city',
        'country',
        [sequelize.fn('MAX', sequelize.col('time')), 'date'],
        'weather',
      ],
    });
  }
}

async function sendWeatherEmail(cities) {
  const weatherData = await getWeatherData(cities.map(city => city.city));
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const emailHTML = weatherData.map(data => `
    <tr>
      <td>${data.city}</td>
      <td>${data.country}</td>
      <td>${data.date}</td>
      <td>${data.weather}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_USER,
    subject: 'Weather Data',
    html: `<table>${emailHTML}</table>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  fetchAndSaveWeatherData,
  getWeatherData,
  sendWeatherEmail,
};
