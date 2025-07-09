import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

dotenv.config();

const PORT = process.env['PORT'] || 4000;

// Support multiple CORS origins with wildcard pattern matching
const getAllowedOrigins = (): string[] => {
  const corsOrigin = process.env['CORS_ORIGIN'];
  const defaultOrigins = ['http://localhost:3000'];
  
  if (corsOrigin) {
    // If multiple origins are provided (comma-separated)
    if (corsOrigin.includes(',')) {
      return corsOrigin.split(',').map(origin => origin.trim());
    }
    return [corsOrigin];
  }
  
  return defaultOrigins;
};

// Function to check if origin matches allowed patterns
const isOriginAllowed = (origin: string, allowedOrigins: string[]): boolean => {
  // Check exact matches first
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  
  // Check wildcard patterns
  for (const allowedOrigin of allowedOrigins) {
    if (allowedOrigin.includes('*')) {
      // Convert wildcard pattern to regex
      const regexPattern = allowedOrigin
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\*/g, '.*');  // Convert * to .*
      
      const regex = new RegExp(`^${regexPattern}$`);
      
      if (regex.test(origin)) {
        return true;
      }
    }
  }
  
  return false;
};

const ALLOWED_ORIGINS = getAllowedOrigins();

async function startServer() {
  // Redis removed - using localStorage and CDN caching instead

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Add Cache-Control headers for CDN caching
  app.use((req, res, next) => {
    // Set cache headers for GraphQL responses
    if (req.path === '/graphql') {
      res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }
    next();
  });

  app.use(
    '/graphql',
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (isOriginAllowed(origin, ALLOWED_ORIGINS)) {
          console.log(`CORS allowed origin: ${origin}`);
          return callback(null, true);
        }
        
        // Log rejected origins for debugging
        console.log(`CORS rejected origin: ${origin}`);
        console.log(`Allowed patterns: ${ALLOWED_ORIGINS.join(', ')}`);
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
        graphql: {
          status: 'running'
        }
      };

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
    console.log(`💾 CDN caching enabled with 24-hour TTL`);
    console.log(`🌐 CORS enabled for origins:`, ALLOWED_ORIGINS);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
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