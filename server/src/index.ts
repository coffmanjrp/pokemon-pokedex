import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { cacheService } from './services/cacheService';

dotenv.config();

const PORT = process.env['PORT'] || 4000;
const CORS_ORIGIN = process.env['CORS_ORIGIN'] || 'http://localhost:3000';

async function startServer() {
  // Initialize cache service
  console.log('Connecting to Redis cache...');
  await cacheService.connect();

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          req,
        };
      },
    })
  );

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  const httpServer = app.listen(Number(PORT), () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health check at http://localhost:${PORT}/health`);
    console.log(`💾 Redis cache enabled`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await cacheService.disconnect();
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});