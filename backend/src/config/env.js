module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3001,
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'mern_db',
  DB_DIALECT: process.env.DB_DIALECT || 'mysql',
  JWT_SECRET: process.env.JWT_SECRET || 'change_me_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ACTIVATION_TOKEN_TTL_HOURS: parseInt(process.env.ACTIVATION_TOKEN_TTL_HOURS, 10) || 24,
  RESET_TOKEN_TTL_HOURS: parseInt(process.env.RESET_TOKEN_TTL_HOURS, 10) || 1,
};
