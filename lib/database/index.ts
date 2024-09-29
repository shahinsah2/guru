// lib/database/index.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use 'const' for the cached object but modify its internal properties
const cached: Cached = (global as typeof global & { mongoose: Cached }).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'guru1',
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

// Assign cached back to global for subsequent access
(global as typeof global & { mongoose: Cached }).mongoose = cached;
