import { createClient, RedisClientType } from 'redis';
import { createHash } from 'crypto';

class CacheService {
  private client: RedisClientType | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    try {
      this.client = createClient({
        url: process.env['REDIS_URL'] || 'redis://localhost:6379',
        socket: {
          connectTimeout: 5000,
        },
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
      });

      await this.client.connect();
      this.isConnected = true;
    } catch (error) {
      console.warn('Redis connection failed, continuing without cache:', error);
      this.isConnected = false;
    }
  }

  private generateKey(prefix: string, ...parts: (string | number)[]): string {
    const keyData = parts.join(':');
    const hash = createHash('md5').update(keyData).digest('hex');
    return `${prefix}:${hash}`;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Helper methods for Pokemon-specific caching
  getPokemonKey(id: number): string {
    return this.generateKey('pokemon', id.toString());
  }

  getPokemonListKey(limit: number, offset: number): string {
    return this.generateKey('pokemon-list', limit.toString(), offset.toString());
  }

  getSpeciesKey(id: number): string {
    return this.generateKey('species', id.toString());
  }

  getMoveKey(id: number): string {
    return this.generateKey('move', id.toString());
  }

  getEvolutionChainKey(id: number): string {
    return this.generateKey('evolution-chain', id.toString());
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }
}

export const cacheService = new CacheService();