require('dotenv').config();
const app = require('./app');
const { PORT } = require('./config/env');
const sequelize = require('./config/database');

const start = async () => {
  await sequelize.authenticate();
  console.log('Database connection established.');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
