const express = require('express');
const bodyParser = require('body-parser');
const weatherRoutes = require('./routes/weatherRoutes');
const { sequelize } = require('./models');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use('/api', weatherRoutes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
