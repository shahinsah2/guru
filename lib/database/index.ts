// lib/database/index.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use const as cached is never reassigned
const cached: MongooseCache = (global as typeof global & { mongooseCache?: MongooseCache }).mongooseCache || { conn: null, promise: null };

// Assign cached back to global if it doesn't exist yet
(global as typeof global & { mongooseCache: MongooseCache }).mongooseCache = cached;

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: 'guru1',
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};


