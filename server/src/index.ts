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

// Support multiple CORS origins
const getAllowedOrigins = (): string[] => {
  const corsOrigin = process.env['CORS_ORIGIN'];
  const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];
  
  if (corsOrigin) {
    // If multiple origins are provided (comma-separated)
    if (corsOrigin.includes(',')) {
      return corsOrigin.split(',').map(origin => origin.trim());
    }
    return [corsOrigin];
  }
  
  return defaultOrigins;
};

const ALLOWED_ORIGINS = getAllowedOrigins();

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
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (ALLOWED_ORIGINS.includes(origin)) {
          return callback(null, true);
        }
        
        // Log rejected origins for debugging
        console.log(`CORS rejected origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      },
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

  app.get('/health', async (req, res) => {
    try {
      const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env['NODE_ENV'] || 'development',
        port: PORT,
        redis: {
          connected: false,
          error: null as string | null
        },
        graphql: {
          status: 'running'
        }
      };

      // Check Redis connection
      try {
        await cacheService.get('health-check');
        health.redis.connected = true;
      } catch (error) {
        health.redis.connected = false;
        health.redis.error = error instanceof Error ? error.message : 'Unknown error';
      }

      res.json(health);
    } catch (error) {
      res.status(500).json({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = app.listen(Number(PORT), () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health check at http://localhost:${PORT}/health`);
    console.log(`💾 Redis cache enabled`);
    console.log(`🌐 CORS enabled for origins:`, ALLOWED_ORIGINS);
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