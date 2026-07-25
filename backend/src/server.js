require('dotenv').config();
const http = require('http');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const app = require('./app');
const schema = require('./graphql/schema');
const { PORT } = require('./config/env');
const sequelize = require('./config/database');

const start = async () => {
  await sequelize.authenticate();
  console.log('Database connection established.');

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    ...schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apolloServer.start();

  app.use('/api/v1/graphql', expressMiddleware(apolloServer));

  await new Promise((resolve) => httpServer.listen(PORT, resolve));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/api/v1/graphql`);
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
